import { type Component, type JSX, Show, splitProps } from "solid-js";

export type ChartEmptyProps = {
  /** Empty state message */
  message?: string;
  /** Custom icon */
  icon?: JSX.Element;
  /** CSS class */
  class?: string;
};

/**
 * Default chart icon for empty state
 */
function DefaultChartIcon() {
  return (
    <svg
      class="h-12 w-12"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

/**
 * ChartEmpty - Displays empty state when no data is available
 *
 * Shows a centered message with an optional icon to indicate
 * that there is no chart data to display.
 */
export const ChartEmpty: Component<ChartEmptyProps> = (props) => {
  const [local, _others] = splitProps(props, ["message", "icon", "class"]);

  const message = () => local.message ?? "No data available";

  return (
    <foreignObject height="100%" width="100%" x="0" y="0">
      <div
        class={`flex h-full w-full flex-col items-center justify-center gap-3 ${local.class ?? ""}`}
        style={{
          color: "hsl(var(--muted-foreground))",
        }}
      >
        <Show fallback={<DefaultChartIcon />} when={local.icon}>
          {local.icon}
        </Show>
        <p
          class="text-sm"
          style={{
            color: "hsl(var(--muted-foreground))",
          }}
        >
          {message()}
        </p>
      </div>
    </foreignObject>
  );
};

export default ChartEmpty;
