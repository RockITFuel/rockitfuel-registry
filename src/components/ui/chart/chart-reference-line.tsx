import { type Component, createMemo, Show, splitProps } from "solid-js";
import { useChart } from "./chart-context";

export type ChartReferenceLineProps = {
  /** X position (for vertical line) */
  x?: number | Date | string;
  /** Y position (for horizontal line) */
  y?: number;
  /** Line color */
  stroke?: string;
  /** Line width */
  strokeWidth?: number;
  /** Dash pattern (e.g., "4,4") */
  strokeDasharray?: string;
  /** Label text */
  label?: string;
  /** Label position along the line */
  labelPosition?: "start" | "center" | "end";
  /** Label offset from line */
  labelOffset?: number;
  /** Label fill color */
  labelFill?: string;
  /** Label font size */
  labelFontSize?: number;
  /** CSS class */
  class?: string;
};

/**
 * ChartReferenceLine - Renders reference lines for thresholds and targets
 *
 * Supports both horizontal (y) and vertical (x) reference lines
 * with optional labels at configurable positions.
 */
export const ChartReferenceLine: Component<ChartReferenceLineProps> = (
  props
) => {
  const [local, _others] = splitProps(props, [
    "x",
    "y",
    "stroke",
    "strokeWidth",
    "strokeDasharray",
    "label",
    "labelPosition",
    "labelOffset",
    "labelFill",
    "labelFontSize",
    "class",
  ]);

  const chart = useChart();

  const stroke = () => local.stroke ?? "hsl(var(--muted-foreground))";
  const strokeWidth = () => local.strokeWidth ?? 1;
  const strokeDasharray = () => local.strokeDasharray ?? "4,4";
  const labelPosition = () => local.labelPosition ?? "end";
  const labelOffset = () => local.labelOffset ?? 4;
  const labelFill = () => local.labelFill ?? "hsl(var(--muted-foreground))";
  const labelFontSize = () => local.labelFontSize ?? 11;

  // Calculate horizontal line coordinates
  const horizontalLine = createMemo(() => {
    if (local.y === undefined) return null;

    const yScale = chart.yScale();
    const innerWidth = chart.dimensions().innerWidth;
    const y = yScale(local.y);

    // Don't render if out of bounds
    if (y < 0 || y > chart.dimensions().innerHeight) return null;

    return {
      x1: 0,
      x2: innerWidth,
      y1: y,
      y2: y,
    };
  });

  // Calculate vertical line coordinates
  const verticalLine = createMemo(() => {
    if (local.x === undefined) return null;

    const xScale = chart.xScale();
    const xType = chart.xType();
    const innerHeight = chart.dimensions().innerHeight;

    let x: number;

    if (xType === "band") {
      const bandScale = xScale as d3.ScaleBand<string>;
      x = (bandScale(String(local.x)) ?? 0) + bandScale.bandwidth() / 2;
    } else if (local.x instanceof Date) {
      x = (xScale as d3.ScaleTime<number, number>)(local.x);
    } else if (typeof local.x === "number") {
      x = (xScale as d3.ScaleLinear<number, number>)(local.x);
    } else {
      // Try parsing as date
      const date = new Date(local.x);
      if (isNaN(date.getTime())) {
        return null;
      }
      x = (xScale as d3.ScaleTime<number, number>)(date);
    }

    // Don't render if out of bounds
    if (x < 0 || x > chart.dimensions().innerWidth) return null;

    return {
      x1: x,
      x2: x,
      y1: 0,
      y2: innerHeight,
    };
  });

  // Calculate label position for horizontal line
  const horizontalLabelPos = createMemo(() => {
    const line = horizontalLine();
    if (!(line && local.label)) return null;

    const pos = labelPosition();
    const off = labelOffset();
    const innerWidth = chart.dimensions().innerWidth;

    let x: number;
    let textAnchor: "start" | "middle" | "end";

    switch (pos) {
      case "start":
        x = 0;
        textAnchor = "start";
        break;
      case "center":
        x = innerWidth / 2;
        textAnchor = "middle";
        break;
      case "end":
      default:
        x = innerWidth;
        textAnchor = "end";
        break;
    }

    return {
      x,
      y: line.y1 - off,
      textAnchor,
    };
  });

  // Calculate label position for vertical line
  const verticalLabelPos = createMemo(() => {
    const line = verticalLine();
    if (!(line && local.label)) return null;

    const pos = labelPosition();
    const off = labelOffset();
    const innerHeight = chart.dimensions().innerHeight;

    let y: number;
    let dominantBaseline: "auto" | "middle" | "hanging";

    switch (pos) {
      case "start":
        y = 0;
        dominantBaseline = "hanging";
        break;
      case "center":
        y = innerHeight / 2;
        dominantBaseline = "middle";
        break;
      case "end":
      default:
        y = innerHeight;
        dominantBaseline = "auto";
        break;
    }

    return {
      x: line.x1 + off,
      y,
      dominantBaseline,
      textAnchor: "start" as const,
    };
  });

  return (
    <g class={`chart-reference-line ${local.class ?? ""}`}>
      {/* Horizontal reference line */}
      <Show when={horizontalLine()}>
        <line
          stroke={stroke()}
          stroke-dasharray={strokeDasharray()}
          stroke-width={strokeWidth()}
          x1={horizontalLine()!.x1}
          x2={horizontalLine()!.x2}
          y1={horizontalLine()!.y1}
          y2={horizontalLine()!.y2}
        />
        <Show when={horizontalLabelPos()}>
          <text
            dominant-baseline="auto"
            fill={labelFill()}
            font-size={labelFontSize()}
            text-anchor={horizontalLabelPos()!.textAnchor}
            x={horizontalLabelPos()!.x}
            y={horizontalLabelPos()!.y}
          >
            {local.label}
          </text>
        </Show>
      </Show>

      {/* Vertical reference line */}
      <Show when={verticalLine()}>
        <line
          stroke={stroke()}
          stroke-dasharray={strokeDasharray()}
          stroke-width={strokeWidth()}
          x1={verticalLine()!.x1}
          x2={verticalLine()!.x2}
          y1={verticalLine()!.y1}
          y2={verticalLine()!.y2}
        />
        <Show when={verticalLabelPos()}>
          <text
            dominant-baseline={verticalLabelPos()!.dominantBaseline}
            fill={labelFill()}
            font-size={labelFontSize()}
            text-anchor={verticalLabelPos()!.textAnchor}
            x={verticalLabelPos()!.x}
            y={verticalLabelPos()!.y}
          >
            {local.label}
          </text>
        </Show>
      </Show>
    </g>
  );
};

export default ChartReferenceLine;
