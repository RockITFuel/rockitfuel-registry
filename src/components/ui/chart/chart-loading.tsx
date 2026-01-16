import { type Component, For, Show, splitProps } from "solid-js";

export type ChartLoadingProps = {
  /** Loading indicator type */
  variant?: "skeleton" | "spinner";
  /** Number of skeleton bars (for skeleton variant) */
  bars?: number;
  /** CSS class */
  class?: string;
};

/**
 * Spinner component
 */
function Spinner() {
  return (
    <svg
      class="h-8 w-8 animate-spin"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
      <path
        class="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Skeleton bars component
 */
function SkeletonBars(props: { bars: number }) {
  // Generate random heights for visual variation
  const heights = () => {
    const h = [];
    for (let i = 0; i < props.bars; i++) {
      h.push(30 + Math.random() * 50); // 30-80% height
    }
    return h;
  };

  return (
    <div class="flex h-full w-full items-end justify-around gap-2 px-8 pb-8">
      <For each={heights()}>
        {(height, index) => (
          <div
            class="animate-pulse rounded-t"
            style={{
              background: "hsl(var(--muted))",
              width: `${Math.floor(70 / props.bars)}%`,
              height: `${height}%`,
              "animation-delay": `${index() * 100}ms`,
            }}
          />
        )}
      </For>
    </div>
  );
}

/**
 * ChartLoading - Displays loading state while data is being fetched
 *
 * Supports two variants:
 * - skeleton: Shows animated bar-like shapes
 * - spinner: Shows a centered spinning indicator
 */
export const ChartLoading: Component<ChartLoadingProps> = (props) => {
  const [local, _others] = splitProps(props, ["variant", "bars", "class"]);

  const variant = () => local.variant ?? "skeleton";
  const bars = () => local.bars ?? 5;

  return (
    <foreignObject height="100%" width="100%" x="0" y="0">
      <div
        class={`flex h-full w-full items-center justify-center ${local.class ?? ""}`}
        style={{
          color: "hsl(var(--muted-foreground))",
        }}
      >
        <Show
          fallback={<SkeletonBars bars={bars()} />}
          when={variant() === "spinner"}
        >
          <Spinner />
        </Show>
      </div>
    </foreignObject>
  );
};

export default ChartLoading;
