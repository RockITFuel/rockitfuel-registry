import { type Component, createMemo, For, Show, splitProps } from "solid-js";
import { useChart } from "./chart-context";
import type { TickFormat, TickFormatPreset } from "./types";

/** Common axis props */
type BaseAxisProps = {
  /** Tick label formatter - preset name or custom function */
  tickFormat?: TickFormat;
  /** Approximate number of ticks */
  tickCount?: number;
  /** Show tick lines */
  tickLine?: boolean;
  /** Show axis line */
  axisLine?: boolean;
  /** Axis label text */
  label?: string;
  /** Label distance from axis */
  labelOffset?: number;
  /** Override scale domain */
  domain?: [number, number];
  /** Hide axis but keep space */
  hide?: boolean;
  /** CSS class */
  class?: string;
};

export type ChartXAxisProps = BaseAxisProps & {
  /** Axis position */
  orientation?: "top" | "bottom";
};

export type ChartYAxisProps = BaseAxisProps & {
  /** Axis position */
  orientation?: "left" | "right";
};

/** Preset tick formatters */
const tickFormatters: Record<TickFormatPreset, (value: unknown) => string> = {
  date: (value) => {
    if (value instanceof Date) {
      return value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return String(value);
  },
  number: (value) => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value);
  },
  percent: (value) => {
    if (typeof value === "number") {
      return `${(value * 100).toFixed(0)}%`;
    }
    return String(value);
  },
  currency: (value) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return String(value);
  },
};

/** Get formatter function from preset or custom */
function getFormatter(format?: TickFormat): (value: unknown) => string {
  if (!format) {
    return (value) => {
      if (value instanceof Date) {
        return tickFormatters.date(value);
      }
      if (typeof value === "number") {
        return tickFormatters.number(value);
      }
      return String(value);
    };
  }

  if (typeof format === "function") {
    return format;
  }

  return tickFormatters[format];
}

/**
 * ChartXAxis - Renders the X axis with ticks and labels
 */
export const ChartXAxis: Component<ChartXAxisProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "tickFormat",
    "tickCount",
    "tickLine",
    "axisLine",
    "label",
    "labelOffset",
    "orientation",
    "domain",
    "hide",
    "class",
  ]);

  const chart = useChart();

  const orientation = () => local.orientation ?? "bottom";
  const tickCount = () => local.tickCount ?? 6;
  const showTickLine = () => local.tickLine !== false;
  const showAxisLine = () => local.axisLine !== false;
  const labelOffset = () => local.labelOffset ?? 35;

  const formatter = createMemo(() => getFormatter(local.tickFormat));

  const ticks = createMemo(() => {
    const xScale = chart.xScale();
    const xType = chart.xType();

    if (xType === "band") {
      const bandScale = xScale as d3.ScaleBand<string>;
      return bandScale.domain().map((d) => ({
        value: d,
        position: (bandScale(d) ?? 0) + bandScale.bandwidth() / 2,
      }));
    }

    // Time or linear scale
    const continuousScale = xScale as d3.ScaleTime<number, number>;
    const tickValues = continuousScale.ticks(tickCount());
    return tickValues.map((d) => ({
      value: d,
      position: continuousScale(d),
    }));
  });

  const y = createMemo(() => {
    const { innerHeight } = chart.dimensions();
    return orientation() === "bottom" ? innerHeight : 0;
  });

  const tickDirection = () => (orientation() === "bottom" ? 1 : -1);

  return (
    <Show when={!local.hide}>
      <g
        class={local.class ?? "chart-x-axis"}
        transform={`translate(0,${y()})`}
      >
        {/* Axis line */}
        <Show when={showAxisLine()}>
          <line
            stroke="hsl(var(--border))"
            stroke-width={1}
            x1={0}
            x2={chart.dimensions().innerWidth}
            y1={0}
            y2={0}
          />
        </Show>

        {/* Ticks */}
        <For each={ticks()}>
          {(tick) => (
            <g transform={`translate(${tick.position},0)`}>
              {/* Tick line */}
              <Show when={showTickLine()}>
                <line
                  stroke="hsl(var(--border))"
                  stroke-width={1}
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={6 * tickDirection()}
                />
              </Show>
              {/* Tick label */}
              <text
                dominant-baseline={
                  orientation() === "bottom" ? "hanging" : "auto"
                }
                fill="hsl(var(--muted-foreground))"
                font-size="12px"
                text-anchor="middle"
                x={0}
                y={20 * tickDirection()}
              >
                {formatter()(tick.value)}
              </text>
            </g>
          )}
        </For>

        {/* Axis label */}
        <Show when={local.label}>
          <text
            fill="hsl(var(--muted-foreground))"
            font-size="12px"
            text-anchor="middle"
            x={chart.dimensions().innerWidth / 2}
            y={labelOffset() * tickDirection()}
          >
            {local.label}
          </text>
        </Show>
      </g>
    </Show>
  );
};

/**
 * ChartYAxis - Renders the Y axis with ticks and labels
 */
export const ChartYAxis: Component<ChartYAxisProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "tickFormat",
    "tickCount",
    "tickLine",
    "axisLine",
    "label",
    "labelOffset",
    "orientation",
    "domain",
    "hide",
    "class",
  ]);

  const chart = useChart();

  const orientation = () => local.orientation ?? "left";
  const tickCount = () => local.tickCount ?? 5;
  const showTickLine = () => local.tickLine !== false;
  const showAxisLine = () => local.axisLine !== false;
  const labelOffset = () => local.labelOffset ?? 40;

  const formatter = createMemo(() => getFormatter(local.tickFormat));

  const ticks = createMemo(() => {
    const yScale =
      orientation() === "left"
        ? chart.yScale()
        : (chart.yScaleRight() ?? chart.yScale());

    const tickValues = yScale.ticks(tickCount());
    return tickValues.map((d) => ({
      value: d,
      position: yScale(d),
    }));
  });

  const x = createMemo(() => {
    const { innerWidth } = chart.dimensions();
    return orientation() === "left" ? 0 : innerWidth;
  });

  const tickDirection = () => (orientation() === "left" ? -1 : 1);
  const textAnchor = () => (orientation() === "left" ? "end" : "start");

  return (
    <Show when={!local.hide}>
      <g
        class={local.class ?? "chart-y-axis"}
        transform={`translate(${x()},0)`}
      >
        {/* Axis line */}
        <Show when={showAxisLine()}>
          <line
            stroke="hsl(var(--border))"
            stroke-width={1}
            x1={0}
            x2={0}
            y1={0}
            y2={chart.dimensions().innerHeight}
          />
        </Show>

        {/* Ticks */}
        <For each={ticks()}>
          {(tick) => (
            <g transform={`translate(0,${tick.position})`}>
              {/* Tick line */}
              <Show when={showTickLine()}>
                <line
                  stroke="hsl(var(--border))"
                  stroke-width={1}
                  x1={0}
                  x2={6 * tickDirection()}
                  y1={0}
                  y2={0}
                />
              </Show>
              {/* Tick label */}
              <text
                dominant-baseline="middle"
                fill="hsl(var(--muted-foreground))"
                font-size="12px"
                text-anchor={textAnchor()}
                x={10 * tickDirection()}
                y={0}
              >
                {formatter()(tick.value)}
              </text>
            </g>
          )}
        </For>

        {/* Axis label */}
        <Show when={local.label}>
          <text
            fill="hsl(var(--muted-foreground))"
            font-size="12px"
            text-anchor="middle"
            transform={`rotate(-90) translate(${-chart.dimensions().innerHeight / 2},${orientation() === "left" ? -labelOffset() : labelOffset()})`}
            x={0}
            y={-labelOffset()}
          >
            {local.label}
          </text>
        </Show>
      </g>
    </Show>
  );
};

export default { ChartXAxis, ChartYAxis };
