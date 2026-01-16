import { type Component, createMemo, For, splitProps } from "solid-js";
import { useChart } from "./chart-context";

export type ChartLabelProps = {
  /** Key for label values */
  dataKey: string;
  /** Key in data for X values */
  xKey?: string;
  /** Label position relative to data point */
  position?: "top" | "center" | "bottom" | "inside" | "outside";
  /** Value formatter */
  formatter?: (value: number) => string;
  /** Distance from element */
  offset?: number;
  /** Text color */
  fill?: string;
  /** Font size */
  fontSize?: number;
  /** Font weight */
  fontWeight?: string | number;
  /** CSS class */
  class?: string;
};

/**
 * Default value formatter
 */
function defaultFormatter(value: number): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

/**
 * ChartLabel - Renders data labels on chart elements
 *
 * Positions text labels relative to data points based on
 * the chart's scale configuration.
 */
export const ChartLabel: Component<ChartLabelProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "dataKey",
    "xKey",
    "position",
    "formatter",
    "offset",
    "fill",
    "fontSize",
    "fontWeight",
    "class",
  ]);

  const chart = useChart();

  const xKey = () => local.xKey ?? chart.xKey();
  const position = () => local.position ?? "top";
  const offset = () => local.offset ?? 5;
  const fontSize = () => local.fontSize ?? 12;
  const fill = () => local.fill ?? "hsl(var(--foreground))";
  const formatter = () => local.formatter ?? defaultFormatter;

  // Check if this series is hidden
  const isHidden = () => chart.hiddenSeries().has(local.dataKey);

  // Calculate label positions
  const labels = createMemo(() => {
    if (isHidden()) return [];

    const data = chart.data();
    const xScale = chart.xScale();
    const yScale = chart.yScale();
    const x = xKey();
    const key = local.dataKey;
    const xType = chart.xType();
    const innerHeight = chart.dimensions().innerHeight;
    const pos = position();
    const off = offset();

    return data
      .map((d) => {
        const xVal = d[x];
        const yVal = d[key];

        if (typeof yVal !== "number" || isNaN(yVal)) {
          return null;
        }

        // Calculate X position
        let labelX: number;
        if (xType === "band") {
          const bandScale = xScale as d3.ScaleBand<string>;
          labelX = (bandScale(String(xVal)) ?? 0) + bandScale.bandwidth() / 2;
        } else {
          labelX = (xScale as d3.ScaleTime<number, number>)(xVal as Date);
        }

        // Calculate Y position based on position prop
        const dataY = yScale(yVal);
        let labelY: number;
        const textAnchor: "start" | "middle" | "end" = "middle";
        let dominantBaseline: "auto" | "middle" | "hanging" = "auto";

        switch (pos) {
          case "top":
            labelY = dataY - off;
            dominantBaseline = "auto";
            break;
          case "bottom":
            labelY = dataY + off;
            dominantBaseline = "hanging";
            break;
          case "center":
          case "inside":
            // Inside the bar (for bar charts)
            labelY = (dataY + innerHeight) / 2;
            dominantBaseline = "middle";
            break;
          case "outside":
            // Above for positive values
            labelY = dataY - off;
            dominantBaseline = "auto";
            break;
          default:
            labelY = dataY - off;
        }

        return {
          x: labelX,
          y: labelY,
          value: yVal,
          text: formatter()(yVal),
          textAnchor,
          dominantBaseline,
        };
      })
      .filter(Boolean) as Array<{
      x: number;
      y: number;
      value: number;
      text: string;
      textAnchor: "start" | "middle" | "end";
      dominantBaseline: "auto" | "middle" | "hanging";
    }>;
  });

  // Don't render if hidden
  if (isHidden()) return null;

  return (
    <g class={`chart-label ${local.class ?? ""}`}>
      <For each={labels()}>
        {(label) => (
          <text
            class="chart-label-text"
            dominant-baseline={label.dominantBaseline}
            fill={fill()}
            font-size={fontSize()}
            font-weight={local.fontWeight}
            text-anchor={label.textAnchor}
            x={label.x}
            y={label.y}
          >
            {label.text}
          </text>
        )}
      </For>
    </g>
  );
};

export default ChartLabel;
