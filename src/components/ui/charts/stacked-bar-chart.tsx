import { select, stack } from "d3";
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

export type StackedBarDataPoint = {
  category: string;
  [key: string]: string | number;
};

export type StackedBarChartProps = {
  data: StackedBarDataPoint[];
  keys: string[];
  keyLabels?: Record<string, string>;
  width?: number;
  height?: number;
  margin?: Partial<ChartMargin>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  barPadding?: number;
  colors?: readonly string[];
  class?: string;
};

type TooltipContent = {
  category: string;
  key: string;
  keyLabel: string;
  value: number;
  total: number;
  color: string;
};

export const StackedBarChart: Component<StackedBarChartProps> = (props) => {
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
    const colors = props.colors ?? defaultColorPalette;
    return createColorScale(props.keys, colors);
  });

  const categories = createMemo(() => props.data.map((d) => d.category));

  const stackedData = createMemo(() => {
    const stackGenerator = stack<StackedBarDataPoint>().keys(props.keys);
    return stackGenerator(props.data);
  });

  const xScale = createMemo(() => {
    const { innerWidth } = dimensions();
    return createBandScale(categories(), [0, innerWidth], {
      padding: props.barPadding ?? 0.2,
    });
  });

  const yScale = createMemo(() => {
    const { innerHeight } = dimensions();
    const maxY = Math.max(
      ...props.data.map((d) => {
        let sum = 0;
        for (const key of props.keys) {
          const val = d[key];
          if (typeof val === "number") {
            sum += val;
          }
        }
        return sum;
      })
    );
    return createLinearScale([0, maxY * 1.1], [innerHeight, 0], {
      nice: true,
    });
  });

  const getKeyColor = (key: string, index: number): string =>
    colorScale()(key) ??
    getColorFromPalette(index, props.colors ?? defaultColorPalette);

  const getKeyLabel = (key: string): string => props.keyLabels?.[key] ?? key;

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

  const computeTotal = (dataIndex: number): number => {
    let total = 0;
    for (const k of props.keys) {
      const val = props.data[dataIndex][k];
      if (typeof val === "number") {
        total += val;
      }
    }
    return total;
  };

  const isPointInBar = (opts: {
    mouseX: number;
    mouseY: number;
    barX: number;
    bandwidth: number;
    barY0: number;
    barY1: number;
  }): boolean =>
    opts.mouseX >= opts.barX &&
    opts.mouseX <= opts.barX + opts.bandwidth &&
    opts.mouseY >= opts.barY1 &&
    opts.mouseY <= opts.barY0;

  const findClosestBar = (
    mouseX: number,
    mouseY: number
  ): TooltipContent | null => {
    const xS = xScale();
    const yS = yScale();
    const bandwidth = xS.bandwidth();

    for (let keyIndex = 0; keyIndex < stackedData().length; keyIndex++) {
      const seriesData = stackedData()[keyIndex];
      const key = props.keys[keyIndex];

      for (let i = 0; i < seriesData.length; i++) {
        const d = seriesData[i];
        const category = props.data[i].category;
        const barX = xS(category) ?? 0;
        const barY0 = yS(d[0]);
        const barY1 = yS(d[1]);

        if (isPointInBar({ mouseX, mouseY, barX, bandwidth, barY0, barY1 })) {
          return {
            category,
            key,
            keyLabel: getKeyLabel(key),
            value: d[1] - d[0],
            total: computeTotal(i),
            color: getKeyColor(key, keyIndex),
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

            <For each={stackedData()}>
              {(seriesData, keyIndex) => {
                const color = () =>
                  getKeyColor(props.keys[keyIndex()], keyIndex());

                return (
                  <g class="series">
                    <For each={seriesData}>
                      {(d, i) => {
                        const barX = () =>
                          xScale()(props.data[i()].category) ?? 0;
                        const barY = () => yScale()(d[1]);
                        const barWidth = () => xScale().bandwidth();
                        const barHeight = () => yScale()(d[0]) - yScale()(d[1]);

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

        <Show when={props.showLegend !== false && props.keys.length > 1}>
          <div class="mt-4 flex flex-wrap justify-center gap-4">
            <For each={props.keys}>
              {(key, index) => (
                <div class="flex items-center gap-2">
                  <span
                    class="h-3 w-3 rounded-full"
                    style={{ background: getKeyColor(key, index()) }}
                  />
                  <span class="text-muted-foreground text-sm">
                    {getKeyLabel(key)}
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
              <span class="font-medium">{tooltip.state().data?.keyLabel}</span>
            </div>
            <div class="mt-1 text-muted-foreground text-sm">
              <div>{tooltip.state().data?.category}</div>
              <div class="font-medium text-foreground">
                {formatTooltipValue(tooltip.state().data?.value)}
              </div>
              <div class="text-xs">
                Total: {formatTooltipValue(tooltip.state().data?.total)}
              </div>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default StackedBarChart;
