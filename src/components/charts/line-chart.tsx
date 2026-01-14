import { curveMonotoneX, line, select } from "d3";
import {
  type Component,
  createEffect,
  createMemo,
  For,
  on,
  onMount,
  Show,
} from "solid-js";
import {
  bisectIndex,
  type ChartMargin,
  calculateDimensions,
  chartStyles,
  computeNumericExtent,
  computeTimeExtent,
  createAxisGenerator,
  createColorScale,
  createLinearScale,
  createTimeScale,
  defaultColorPalette,
  getColorFromPalette,
  getRelativeMousePosition,
  renderAxis,
  styleAxis,
  styleGridLines,
  useChartTooltip,
  useResizeObserver,
} from "~/lib/charts";

export type LineDataPoint = {
  x: Date | number;
  y: number;
  label?: string;
};

export type LineSeries = {
  id: string;
  name: string;
  data: LineDataPoint[];
  color?: string;
};

export type LineChartProps = {
  data: LineSeries[];
  width?: number;
  height?: number;
  margin?: Partial<ChartMargin>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  curveType?: "linear" | "monotone";
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  colors?: readonly string[];
  class?: string;
};

type TooltipContent = {
  x: Date | number;
  y: number;
  seriesName: string;
  seriesId: string;
  color: string;
  label?: string;
};

type FindClosestOptions = {
  data: LineSeries[];
  adjustedX: number;
  adjustedY: number;
  xScale: (v: number | Date) => number;
  yScale: (v: number) => number;
  getSeriesColor: (series: LineSeries, index: number) => string;
};

const findClosestDataPoint = (
  options: FindClosestOptions
): TooltipContent | null => {
  const { data, adjustedX, adjustedY, xScale, yScale, getSeriesColor } =
    options;
  let closest: TooltipContent | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (let seriesIndex = 0; seriesIndex < data.length; seriesIndex++) {
    const series = data[seriesIndex];
    if (series.data.length === 0) {
      continue;
    }

    const xAccessor = (d: LineDataPoint) => xScale(d.x as number & Date);
    const index = bisectIndex(series.data, adjustedX, xAccessor);
    const point = series.data[index];
    if (!point) {
      continue;
    }

    const px = xScale(point.x as number & Date);
    const py = yScale(point.y);
    const distance = Math.sqrt((px - adjustedX) ** 2 + (py - adjustedY) ** 2);

    if (distance < minDistance && distance < 50) {
      minDistance = distance;
      closest = {
        x: point.x,
        y: point.y,
        seriesName: series.name,
        seriesId: series.id,
        color: getSeriesColor(series, seriesIndex),
        label: point.label,
      };
    }
  }

  return closest;
};

export const LineChart: Component<LineChartProps> = (props) => {
  // biome-ignore lint/suspicious/noUnassignedVariables: SolidJS ref pattern
  let containerRef: HTMLDivElement | undefined;
  // biome-ignore lint/suspicious/noUnassignedVariables: SolidJS ref pattern
  let svgRef: SVGSVGElement | undefined;
  // biome-ignore lint/suspicious/noUnassignedVariables: SolidJS ref pattern
  let xAxisRef: SVGGElement | undefined;
  // biome-ignore lint/suspicious/noUnassignedVariables: SolidJS ref pattern
  let yAxisRef: SVGGElement | undefined;
  // biome-ignore lint/suspicious/noUnassignedVariables: SolidJS ref pattern
  let gridRef: SVGGElement | undefined;

  const tooltip = useChartTooltip<TooltipContent>();

  const containerSize = useResizeObserver(() => containerRef, {
    debounceMs: 100,
  });

  const dimensions = createMemo(() => {
    const width = props.width ?? containerSize().width;
    const height = props.height ?? containerSize().height ?? 300;
    return calculateDimensions(width, height, props.margin);
  });

  const colorScale = createMemo(() => {
    const seriesIds = props.data.map((s) => s.id);
    const colors = props.colors ?? defaultColorPalette;
    return createColorScale(seriesIds, colors);
  });

  const isTimeScale = createMemo(() => {
    const firstSeries = props.data[0];
    if (!firstSeries?.data[0]) {
      return false;
    }
    return firstSeries.data[0].x instanceof Date;
  });

  const xScale = createMemo(() => {
    const { innerWidth } = dimensions();
    const allXValues = props.data.flatMap((s) => s.data.map((d) => d.x));

    if (isTimeScale()) {
      const extent = computeTimeExtent(allXValues as Date[]);
      return createTimeScale(extent, [0, innerWidth], { nice: true });
    }

    const extent = computeNumericExtent(allXValues as number[], 0.05);
    return createLinearScale(extent, [0, innerWidth], { nice: true });
  });

  const yScale = createMemo(() => {
    const { innerHeight } = dimensions();
    const allYValues = props.data.flatMap((s) => s.data.map((d) => d.y));
    const extent = computeNumericExtent(allYValues, 0.1);
    const minY = Math.min(0, extent[0]);
    return createLinearScale([minY, extent[1]], [innerHeight, 0], {
      nice: true,
    });
  });

  const lineGenerator = createMemo(() => {
    const xS = xScale();
    const yS = yScale();
    const curve = props.curveType === "monotone" ? curveMonotoneX : undefined;

    return line<LineDataPoint>()
      .x((d) => xS(d.x as number & Date))
      .y((d) => yS(d.y))
      .curve(curve ?? curveMonotoneX);
  });

  const getSeriesColor = (series: LineSeries, index: number): string => {
    if (series.color) {
      return series.color;
    }
    return (
      colorScale()(series.id) ??
      getColorFromPalette(index, props.colors ?? defaultColorPalette)
    );
  };

  onMount(() => {
    if (xAxisRef && yAxisRef) {
      updateAxes();
    }
  });

  const updateAxes = () => {
    const { innerWidth, innerHeight } = dimensions();

    if (xAxisRef) {
      const xAxis = createAxisGenerator("bottom", xScale(), {
        tickCount: Math.floor(innerWidth / 80),
      });
      renderAxis(xAxisRef, xAxis);
      styleAxis(xAxisRef);
    }

    if (yAxisRef) {
      const yAxis = createAxisGenerator("left", yScale(), {
        tickCount: Math.floor(innerHeight / 50),
      });
      renderAxis(yAxisRef, yAxis);
      styleAxis(yAxisRef);
    }

    if (gridRef && props.showGrid !== false) {
      const gridAxis = createAxisGenerator("left", yScale(), {
        tickCount: Math.floor(innerHeight / 50),
        tickSize: -innerWidth,
      });
      select(gridRef).call(gridAxis);
      styleGridLines(gridRef);
    }
  };

  createEffect(
    on([dimensions, xScale, yScale], () => {
      updateAxes();
    })
  );

  const handleMouseMove = (event: MouseEvent) => {
    if (!svgRef) {
      return;
    }

    const { margin } = dimensions();
    const mousePos = getRelativeMousePosition(event, svgRef);
    const adjustedX = mousePos.x - margin.left;
    const adjustedY = mousePos.y - margin.top;

    const closest = findClosestDataPoint({
      data: props.data,
      adjustedX,
      adjustedY,
      xScale: xScale(),
      yScale: yScale(),
      getSeriesColor,
    });

    if (closest) {
      tooltip.show(closest, { x: mousePos.x, y: mousePos.y });
    } else {
      tooltip.hide();
    }
  };

  const handleMouseLeave = () => {
    tooltip.hide();
  };

  const formatTooltipX = (x: Date | number | undefined): string => {
    if (x === undefined) {
      return "";
    }
    if (x instanceof Date) {
      return x.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return String(x);
  };

  const formatTooltipY = (y: number | undefined): string => {
    if (y === undefined) {
      return "";
    }
    return y.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      class={`relative w-full ${props.class ?? ""}`}
      ref={containerRef}
      style={{ "min-height": `${props.height ?? 300}px` }}
    >
      <Show when={dimensions().width > 0 && dimensions().height > 0}>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: Chart with programmatic tooltip */}
        {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Chart interaction */}
        <svg
          class="select-none"
          height={dimensions().height}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          ref={svgRef}
          width={dimensions().width}
        >
          <g
            transform={`translate(${dimensions().margin.left},${dimensions().margin.top})`}
          >
            <Show when={props.showGrid !== false}>
              <g class="grid" ref={gridRef} />
            </Show>

            <For each={props.data}>
              {(series, index) => {
                const color = () => getSeriesColor(series, index());
                const pathD = () => lineGenerator()(series.data) ?? "";

                return (
                  <g class="series">
                    <path
                      d={pathD()}
                      fill="none"
                      stroke={color()}
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width={props.strokeWidth ?? 2}
                    />

                    <Show when={props.showDots}>
                      <For each={series.data}>
                        {(point) => (
                          <circle
                            cx={xScale()(point.x as number & Date)}
                            cy={yScale()(point.y)}
                            fill={color()}
                            r={props.dotRadius ?? 4}
                          />
                        )}
                      </For>
                    </Show>
                  </g>
                );
              }}
            </For>

            <g
              class="x-axis"
              ref={xAxisRef}
              transform={`translate(0,${dimensions().innerHeight})`}
            />
            <g class="y-axis" ref={yAxisRef} />

            <Show when={props.xAxisLabel}>
              <text
                fill={chartStyles.axis.text}
                font-size={chartStyles.axis.fontSize}
                text-anchor="middle"
                x={dimensions().innerWidth / 2}
                y={dimensions().innerHeight + dimensions().margin.bottom - 5}
              >
                {props.xAxisLabel}
              </text>
            </Show>

            <Show when={props.yAxisLabel}>
              <text
                fill={chartStyles.axis.text}
                font-size={chartStyles.axis.fontSize}
                text-anchor="middle"
                transform="rotate(-90)"
                x={-dimensions().innerHeight / 2}
                y={-dimensions().margin.left + 15}
              >
                {props.yAxisLabel}
              </text>
            </Show>
          </g>
        </svg>

        <Show when={props.showLegend !== false && props.data.length > 1}>
          <div class="mt-4 flex flex-wrap justify-center gap-4">
            <For each={props.data}>
              {(series, index) => (
                <div class="flex items-center gap-2">
                  <span
                    class="h-3 w-3 rounded-full"
                    style={{ background: getSeriesColor(series, index()) }}
                  />
                  <span class="text-muted-foreground text-sm">
                    {series.name}
                  </span>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={tooltip.isVisible()}>
          <div
            class="pointer-events-none absolute z-50 rounded-md border px-3 py-2 shadow-md"
            style={{
              left: `${tooltip.state().position.x + 10}px`,
              top: `${tooltip.state().position.y + 10}px`,
              background: chartStyles.tooltip.background,
              border: `1px solid ${chartStyles.tooltip.border}`,
              color: chartStyles.tooltip.text,
              "box-shadow": chartStyles.tooltip.shadow,
            }}
          >
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full"
                style={{ background: tooltip.state().data?.color }}
              />
              <span class="font-medium">
                {tooltip.state().data?.seriesName}
              </span>
            </div>
            <div class="mt-1 text-muted-foreground text-sm">
              <div>{formatTooltipX(tooltip.state().data?.x)}</div>
              <div class="font-medium text-foreground">
                {formatTooltipY(tooltip.state().data?.y)}
              </div>
              <Show when={tooltip.state().data?.label}>
                <div class="text-xs">{tooltip.state().data?.label}</div>
              </Show>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default LineChart;
