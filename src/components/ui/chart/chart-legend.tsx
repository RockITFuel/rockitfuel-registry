import { type Component, For, Show, splitProps } from "solid-js";
import { useChart } from "./chart-context";

export type ChartLegendProps = {
  /** Legend position relative to chart */
  position?: "top" | "right" | "bottom" | "left";
  /** Alignment within position */
  align?: "start" | "center" | "end";
  /** Icon shape for legend items */
  iconType?: "circle" | "square" | "line";
  /** Allow clicking to toggle series visibility */
  interactive?: boolean;
  /** CSS class */
  class?: string;
};

/**
 * ChartLegend - Shows series labels with color indicators
 *
 * Configurable position and alignment. Interactive by default,
 * allowing users to click to toggle series visibility.
 */
export const ChartLegend: Component<ChartLegendProps> = (props) => {
  const [local, _others] = splitProps(props, [
    "position",
    "align",
    "iconType",
    "interactive",
    "class",
  ]);

  const chart = useChart();

  const position = () => local.position ?? "bottom";
  const align = () => local.align ?? "center";
  const iconType = () => local.iconType ?? "circle";
  const interactive = () => local.interactive !== false;

  // Get alignment CSS class
  const alignmentClass = () => {
    const a = align();
    if (a === "start") return "justify-start";
    if (a === "end") return "justify-end";
    return "justify-center";
  };

  // Get position CSS classes
  const positionClasses = () => {
    const p = position();
    if (p === "top" || p === "bottom") {
      return `flex flex-row flex-wrap gap-4 ${alignmentClass()}`;
    }
    return "flex flex-col gap-2";
  };

  // Legend items from config
  const legendItems = () => {
    const config = chart.config();
    const dataKeys = chart.dataKeys();
    const colorScale = chart.colorScale();

    return dataKeys.map((key) => ({
      key,
      label: config[key]?.label ?? key,
      color: colorScale(key),
      hidden: chart.hiddenSeries().has(key),
    }));
  };

  // Handle click to toggle series
  const handleClick = (key: string) => {
    if (!interactive()) return;
    chart.toggleSeries(key);
  };

  // Render icon based on type
  const renderIcon = (color: string, hidden: boolean) => {
    const opacity = hidden ? 0.3 : 1;
    const type = iconType();

    if (type === "square") {
      return (
        <span
          class="h-3 w-3 rounded-sm"
          style={{
            background: color,
            opacity,
          }}
        />
      );
    }

    if (type === "line") {
      return (
        <span
          class="h-0.5 w-4 rounded"
          style={{
            background: color,
            opacity,
          }}
        />
      );
    }

    // Default: circle
    return (
      <span
        class="h-2.5 w-2.5 rounded-full"
        style={{
          background: color,
          opacity,
        }}
      />
    );
  };

  return (
    <div
      aria-label="Chart legend"
      class={`chart-legend ${positionClasses()} ${local.class ?? ""}`}
      role="group"
    >
      <For each={legendItems()}>
        {(item) => (
          <button
            aria-label={`${item.label}${item.hidden ? " (hidden)" : ""}`}
            aria-pressed={!item.hidden}
            class={`flex items-center gap-2 text-sm transition-opacity ${
              interactive()
                ? "cursor-pointer hover:opacity-80"
                : "cursor-default"
            } ${item.hidden ? "opacity-50" : ""}`}
            disabled={!interactive()}
            onClick={() => handleClick(item.key)}
            type="button"
          >
            {renderIcon(item.color, item.hidden)}
            <span
              class="text-muted-foreground"
              style={{
                color: "hsl(var(--muted-foreground))",
                "text-decoration": item.hidden ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
          </button>
        )}
      </For>
    </div>
  );
};

/**
 * ChartLegendContent - Wrapper for custom legend content
 *
 * Use this when you need to render legend outside the chart SVG
 * but still want access to chart context.
 */
export const ChartLegendContent: Component<{
  class?: string;
  children?: (items: ReturnType<typeof useChart>["dataKeys"]) => any;
}> = (props) => {
  const chart = useChart();

  return (
    <Show fallback={<ChartLegend class={props.class} />} when={props.children}>
      {props.children?.(chart.dataKeys)}
    </Show>
  );
};

export default ChartLegend;
