import { extent } from "d3-array";
import { scaleBand, scaleLinear, scaleTime } from "d3-scale";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  Show,
} from "solid-js";
import { useResizeObserver } from "~/lib/charts";
import { defaultColorPalette } from "~/lib/charts/theme";
import { cn } from "~/lib/utils";
import { ChartContext } from "./chart-context";
import type {
  ChartAnimation,
  ChartContextValue,
  ChartDimensions,
  ChartMargin,
  ChartRootProps,
  DataPoint,
  XScale,
  YScale,
} from "./types";

const DEFAULT_MARGIN: ChartMargin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
};

const DEFAULT_HEIGHT = 300;

const DEFAULT_ANIMATION: ChartAnimation = {
  duration: 300,
  easing: "ease-out",
};

/**
 * Detect x-axis type from data
 */
function detectXType(
  data: DataPoint[],
  xKey: string
): "time" | "band" | "linear" {
  if (data.length === 0) return "band";

  const firstValue = data[0][xKey];

  if (firstValue instanceof Date) return "time";
  if (typeof firstValue === "number") return "linear";
  return "band";
}

/**
 * Extract numeric data keys from data (excluding x-axis key)
 */
function extractDataKeys(data: DataPoint[], xKey: string): string[] {
  if (data.length === 0) return [];

  const firstPoint = data[0];
  return Object.keys(firstPoint).filter((key) => {
    if (key === xKey) return false;
    const value = firstPoint[key];
    return typeof value === "number";
  });
}

/**
 * ChartRoot - The root container for composable charts
 *
 * Provides context with dimensions, scales, and interaction state to all child components.
 */
export const ChartRoot: Component<ChartRootProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  // SVG ref for tooltip positioning
  const [svgRef, setSvgRef] = createSignal<SVGSVGElement | undefined>(
    undefined
  );

  // Container size from ResizeObserver
  const containerSize = useResizeObserver(() => containerRef, {
    debounceMs: 100,
  });

  // Merge margins with defaults
  const margin = createMemo(
    (): ChartMargin => ({
      ...DEFAULT_MARGIN,
      ...props.margin,
    })
  );

  // Compute dimensions
  const dimensions = createMemo((): ChartDimensions => {
    const width = props.width ?? containerSize().width ?? 0;
    const height = props.height ?? DEFAULT_HEIGHT;
    const m = margin();

    return {
      width,
      height,
      innerWidth: Math.max(0, width - m.left - m.right),
      innerHeight: Math.max(0, height - m.top - m.bottom),
      margin: m,
    };
  });

  // X-axis key
  const xKey = createMemo(() => props.xKey ?? "date");

  // Detect x-axis type
  const xType = createMemo(() => detectXType(props.data, xKey()));

  // Data keys for series
  const [dataKeys, setDataKeys] = createSignal<string[]>([]);

  // Initialize data keys from data
  createEffect(
    on(
      () => props.data,
      (data) => {
        const keys = extractDataKeys(data, xKey());
        setDataKeys(keys);
      }
    )
  );

  // Hidden series for legend toggle
  const [hiddenSeries, setHiddenSeries] = createSignal<Set<string>>(new Set());

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Filtered data (excluding hidden series values for scale computation)
  const visibleData = createMemo(() => props.data);

  // X scale
  const xScale = createMemo((): XScale => {
    const { innerWidth } = dimensions();
    const data = visibleData();
    const key = xKey();
    const type = xType();

    if (type === "time") {
      const dates = data.map((d) => d[key] as Date).filter(Boolean);
      const [minDate, maxDate] = extent(dates) as [Date, Date];
      return scaleTime()
        .domain([minDate ?? new Date(), maxDate ?? new Date()])
        .range([0, innerWidth]);
    }

    if (type === "linear") {
      const values = data.map((d) => d[key] as number).filter((v) => v != null);
      const [min, max] = extent(values) as [number, number];
      return scaleLinear()
        .domain([min ?? 0, max ?? 1])
        .range([0, innerWidth])
        .nice();
    }

    // Band scale for categorical
    const categories = data.map((d) => String(d[key] ?? ""));
    return scaleBand<string>()
      .domain(categories)
      .range([0, innerWidth])
      .padding(0.2);
  });

  // Y scale (left axis)
  const yScale = createMemo((): YScale => {
    const { innerHeight } = dimensions();
    const data = visibleData();
    const keys = dataKeys().filter((k) => !hiddenSeries().has(k));

    if (keys.length === 0 || data.length === 0) {
      return scaleLinear().domain([0, 1]).range([innerHeight, 0]);
    }

    // Find min/max across all visible series
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;

    for (const d of data) {
      for (const key of keys) {
        const value = d[key];
        if (typeof value === "number") {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        }
      }
    }

    // Handle edge cases
    if (!Number.isFinite(minValue)) minValue = 0;
    if (!Number.isFinite(maxValue)) maxValue = 1;
    if (minValue === maxValue) {
      minValue = minValue - 1;
      maxValue = maxValue + 1;
    }

    // Start from 0 if all values are positive
    const domainMin = minValue >= 0 ? 0 : minValue * 1.1;
    const domainMax = maxValue * 1.1;

    return scaleLinear()
      .domain([domainMin, domainMax])
      .range([innerHeight, 0])
      .nice();
  });

  // Y scale right (for dual axis - initially null)
  const yScaleRight = createMemo((): YScale | null => null);

  // Color scale
  const colorScale = createMemo(() => {
    const config = props.config ?? {};
    const keys = dataKeys();

    return (key: string): string => {
      // Use config color if specified
      if (config[key]?.color) {
        return config[key].color;
      }
      // Otherwise use palette
      const index = keys.indexOf(key);
      return defaultColorPalette[index % defaultColorPalette.length];
    };
  });

  // Interaction state
  const [hoveredPoint, setHoveredPointState] = createSignal<DataPoint | null>(
    null
  );
  const [hoveredIndex, setHoveredIndex] = createSignal<number | null>(null);
  const [selectedPoints, setSelectedPoints] = createSignal<DataPoint[]>([]);
  const [brushExtent, setBrushExtent] = createSignal<[Date, Date] | null>(null);
  const [mousePosition, setMousePosition] = createSignal<{
    x: number;
    y: number;
  } | null>(null);

  const setHoveredPoint = (point: DataPoint | null, index: number | null) => {
    setHoveredPointState(point);
    setHoveredIndex(index);
  };

  // Animation config
  const animate = createMemo((): ChartAnimation | false => {
    if (props.animate === false) return false;
    if (props.animate === true || props.animate === undefined)
      return DEFAULT_ANIMATION;
    return props.animate;
  });

  // Context value
  const contextValue: ChartContextValue = {
    dimensions,
    data: () => props.data,
    config: () => props.config ?? {},
    xScale,
    yScale,
    yScaleRight,
    colorScale,
    xKey,
    xType,
    dataKeys,
    setDataKeys,
    hiddenSeries,
    toggleSeries,
    hoveredPoint,
    hoveredIndex,
    selectedPoints,
    brushExtent,
    mousePosition,
    setHoveredPoint,
    setSelectedPoints,
    setBrushExtent,
    setMousePosition,
    animate,
    svgRef,
    setSvgRef,
  };

  const handleMouseMove = (event: MouseEvent) => {
    const svg = svgRef();
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setHoveredPoint(null, null);
  };

  return (
    <div
      class={cn("relative w-full", props.class)}
      ref={containerRef}
      style={{ "min-height": `${props.height ?? DEFAULT_HEIGHT}px` }}
    >
      <ChartContext.Provider value={contextValue}>
        <Show when={dimensions().width > 0 && dimensions().height > 0}>
          <svg
            class="select-none"
            height={dimensions().height}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            ref={setSvgRef}
            role="img"
            width={dimensions().width}
          >
            <g
              transform={`translate(${dimensions().margin.left},${dimensions().margin.top})`}
            >
              {props.children}
            </g>
          </svg>
        </Show>
      </ChartContext.Provider>
    </div>
  );
};

export default ChartRoot;
