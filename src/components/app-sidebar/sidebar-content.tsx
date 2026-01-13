import { JSX } from "solid-js";
import { cn } from "~/lib/utils";

type SidebarContentProps = {
  children: JSX.Element;
  class?: string;
};

export default function SidebarContent(props: SidebarContentProps) {
  return (
    <div class={cn("flex-1 w-full flex flex-col py-6 min-h-0 overflow-y-auto", props.class)}>
      {props.children}
    </div>
  );
}
