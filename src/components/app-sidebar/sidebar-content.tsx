import type { JSX } from "solid-js";
import { cn } from "~/lib/utils";

type SidebarContentProps = {
  children: JSX.Element;
  class?: string;
};

export default function SidebarContent(props: SidebarContentProps) {
  return (
    <div
      class={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-y-auto py-6",
        props.class
      )}
    >
      {props.children}
    </div>
  );
}
