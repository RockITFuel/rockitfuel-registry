import type { JSX } from "solid-js";

type SidebarHeaderProps = {
  children: JSX.Element;
};

export default function SidebarHeader(props: SidebarHeaderProps) {
  return <div class="w-full flex-none">{props.children}</div>;
}
