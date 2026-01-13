import { SearchXIcon } from "lucide-solid";
import { type JSX, Show } from "solid-js";

export type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: JSX.Element;
  class?: string;
};

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div
      class={`flex flex-col items-center justify-center text-center ${props.class || ""}`}
    >
      <Show
        fallback={
          <SearchXIcon class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        }
        when={props.icon}
      >
        {props.icon}
      </Show>
      <h3 class="mb-2 font-medium text-lg">
        {props.title || "Geen resultaten gevonden"}
      </h3>
      <p class="text-muted-foreground">
        {props.description ||
          "Probeer je zoekopdracht aan te passen of check later terug."}
      </p>
    </div>
  );
}
