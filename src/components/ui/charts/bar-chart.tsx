import { select } from "d3";
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
  type ChartMargin,
  calculateDimensions,
  chartStyles,
  computeNumericExtent,
  createAxisGenerator,
  createBandScale,
  createColorScale,
  createLinearScale,
  defaultColorPalette,
  getColorFromPalette,
  getRelativeMousePosition,
  renderAxis,
  styleAxis,
  styleGridLines,
  useChartTooltip,
  useResizeObserver,
} from "~/lib/charts";

export type BarDataPoint = {
  category: string;
  value: number;
  label?: string;
};

export type BarSeries = {
  id: string;
  name: string;
  data: BarDataPoint[];
  color?: string;
};

export type BarChartProps = {
  data: BarSeries[];
  width?: number;
  height?: number;
  margin?: Partial<ChartMargin>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  barPadding?: number;
  groupPadding?: number;
  colors?: readonly string[];
  class?: string;
};

type TooltipContent = {
  category: string;
  value: number;
  seriesName: string;
  seriesId: string;
  color: string;
  label?: string;
};

export const BarChart: Component<BarChartProps> = (props) => {
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

  const categories = createMemo(() => {
    const allCategories = new Set<string>();
    for (const series of props.data) {
      for (const point of series.data) {
        allCategories.add(point.category);
      }
    }
    return Array.from(allCategories);
  });

  const xScale = createMemo(() => {
    const { innerWidth } = dimensions();
    return createBandScale(categories(), [0, innerWidth], {
      padding: props.groupPadding ?? 0.2,
    });
  });

  const xGroupScale = createMemo(() => {
    const bandwidth = xScale().bandwidth();
    const seriesIds = props.data.map((s) => s.id);
    return createBandScale(seriesIds, [0, bandwidth], {
      padding: props.barPadding ?? 0.1,
    });
  });

  const yScale = createMemo(() => {
    const { innerHeight } = dimensions();
    const allYValues = props.data.flatMap((s) => s.data.map((d) => d.value));
    const extent = computeNumericExtent(allYValues, 0.1);
    const minY = Math.min(0, extent[0]);
    return createLinearScale([minY, extent[1]], [innerHeight, 0], {
      nice: true,
    });
  });

  const getSeriesColor = (series: BarSeries, index: number): string => {
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
        tickCount: categories().length,
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

    const closest = findClosestBar(adjustedX, adjustedY);

    if (closest) {
      tooltip.show(closest, { x: mousePos.x, y: mousePos.y });
    } else {
      tooltip.hide();
    }
  };

  const findClosestBar = (
    mouseX: number,
    mouseY: number
  ): TooltipContent | null => {
    const { innerHeight } = dimensions();
    const xS = xScale();
    const xGS = xGroupScale();
    const yS = yScale();

    for (let seriesIndex = 0; seriesIndex < props.data.length; seriesIndex++) {
      const series = props.data[seriesIndex];
      for (const point of series.data) {
        const categoryX = xS(point.category) ?? 0;
        const barX = categoryX + (xGS(series.id) ?? 0);
        const barWidth = xGS.bandwidth();
        const barY = yS(point.value);
        const barHeight = innerHeight - barY;

        if (
          mouseX >= barX &&
          mouseX <= barX + barWidth &&
          mouseY >= barY &&
          mouseY <= barY + barHeight
        ) {
          return {
            category: point.category,
            value: point.value,
            seriesName: series.name,
            seriesId: series.id,
            color: getSeriesColor(series, seriesIndex),
            label: point.label,
          };
        }
      }
    }

    return null;
  };

  const handleMouseLeave = () => {
    tooltip.hide();
  };

  const formatTooltipValue = (value: number | undefined): string => {
    if (value === undefined) {
      return "";
    }
    return value.toLocaleString(undefined, {
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
              {(series, seriesIndex) => {
                const color = () => getSeriesColor(series, seriesIndex());

                return (
                  <g class="series">
                    <For each={series.data}>
                      {(point) => {
                        const barX = () => {
                          const categoryX = xScale()(point.category) ?? 0;
                          const groupOffset = xGroupScale()(series.id) ?? 0;
                          return categoryX + groupOffset;
                        };
                        const barY = () => yScale()(point.value);
                        const barWidth = () => xGroupScale().bandwidth();
                        const barHeight = () =>
                          dimensions().innerHeight - yScale()(point.value);

                        return (
                          <rect
                            fill={color()}
                            height={Math.max(0, barHeight())}
                            rx={2}
                            ry={2}
                            width={barWidth()}
                            x={barX()}
                            y={barY()}
                          />
                        );
                      }}
                    </For>
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
              <div>{tooltip.state().data?.category}</div>
              <div class="font-medium text-foreground">
                {formatTooltipValue(tooltip.state().data?.value)}
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

export default BarChart;
