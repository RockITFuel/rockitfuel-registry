import {
  type Axis,
  type AxisDomain,
  type AxisScale,
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
  format,
  select,
  timeFormat,
} from "d3";
import type {
  AxisOrientation,
  BandScale,
  LinearScale,
  TimeScale,
} from "./types";

type AnyScale = LinearScale | TimeScale | BandScale;

type AxisOptions = {
  tickCount?: number;
  tickFormat?: (value: unknown) => string;
  tickSize?: number;
  tickSizeInner?: number;
  tickSizeOuter?: number;
  tickPadding?: number;
  tickValues?: unknown[];
};

/**
 * Create a D3 axis generator for the given orientation and scale
 */
export function createAxisGenerator<S extends AnyScale>(
  orientation: AxisOrientation,
  scale: S,
  options: AxisOptions = {}
): Axis<AxisDomain> {
  const axisGenerators = {
    top: axisTop,
    right: axisRight,
    bottom: axisBottom,
    left: axisLeft,
  };

  const axis = axisGenerators[orientation](scale as AxisScale<AxisDomain>);

  if (options.tickCount !== undefined) {
    axis.ticks(options.tickCount);
  }

  if (options.tickFormat !== undefined) {
    axis.tickFormat(options.tickFormat as (domainValue: AxisDomain) => string);
  }

  if (options.tickSize !== undefined) {
    axis.tickSize(options.tickSize);
  }

  if (options.tickSizeInner !== undefined) {
    axis.tickSizeInner(options.tickSizeInner);
  }

  if (options.tickSizeOuter !== undefined) {
    axis.tickSizeOuter(options.tickSizeOuter);
  }

  if (options.tickPadding !== undefined) {
    axis.tickPadding(options.tickPadding);
  }

  if (options.tickValues !== undefined) {
    axis.tickValues(options.tickValues as AxisDomain[]);
  }

  return axis;
}

/**
 * Render an axis to an SVG group element
 */
export function renderAxis(
  container: SVGGElement,
  axis: Axis<AxisDomain>,
  options?: {
    animate?: boolean;
    duration?: number;
  }
): void {
  const selection = select(container);

  if (options?.animate) {
    selection
      .transition()
      .duration(options.duration ?? 300)
      .call(axis);
  } else {
    selection.call(axis);
  }
}

/**
 * Apply theme-aware styling to axis elements
 */
export function styleAxis(
  container: SVGGElement,
  options?: {
    lineColor?: string;
    textColor?: string;
    fontSize?: string;
    fontFamily?: string;
  }
): void {
  const selection = select(container);

  // Style the axis line and ticks
  selection
    .selectAll("line, path")
    .attr("stroke", options?.lineColor ?? "hsl(var(--border))");

  // Style the tick text
  selection
    .selectAll("text")
    .attr("fill", options?.textColor ?? "hsl(var(--muted-foreground))")
    .attr("font-size", options?.fontSize ?? "12px")
    .attr("font-family", options?.fontFamily ?? "inherit");
}

/**
 * Create a grid line generator for the given orientation
 */
export function createGridLines<S extends AnyScale>(
  orientation: "horizontal" | "vertical",
  scale: S,
  size: number,
  options?: {
    tickCount?: number;
    tickValues?: unknown[];
  }
): Axis<AxisDomain> {
  const axis =
    orientation === "horizontal"
      ? axisLeft(scale as AxisScale<AxisDomain>).tickSize(-size)
      : axisBottom(scale as AxisScale<AxisDomain>).tickSize(-size);

  axis.tickFormat(() => "");

  if (options?.tickCount !== undefined) {
    axis.ticks(options.tickCount);
  }

  if (options?.tickValues !== undefined) {
    axis.tickValues(options.tickValues as AxisDomain[]);
  }

  return axis;
}

/**
 * Apply styling to grid lines
 */
export function styleGridLines(
  container: SVGGElement,
  options?: {
    color?: string;
    opacity?: number;
    dashArray?: string;
  }
): void {
  const selection = select(container);

  selection
    .selectAll("line")
    .attr("stroke", options?.color ?? "hsl(var(--border))")
    .attr("stroke-opacity", options?.opacity ?? 0.5)
    .attr("stroke-dasharray", options?.dashArray ?? "");

  // Hide the domain line
  selection.select(".domain").attr("stroke", "none");
}

/**
 * Get recommended tick format for different data types
 */
export function getTickFormat(
  type: "number" | "currency" | "percent" | "date" | "shortDate" | "time"
): (value: unknown) => string {
  switch (type) {
    case "number":
      return (v) => format(",.0f")(v as number);
    case "currency":
      return (v) => format("$,.2f")(v as number);
    case "percent":
      return (v) => format(".0%")(v as number);
    case "date":
      return (v) => timeFormat("%b %d, %Y")(v as Date);
    case "shortDate":
      return (v) => timeFormat("%b %d")(v as Date);
    case "time":
      return (v) => timeFormat("%H:%M")(v as Date);
    default:
      return String;
  }
}
