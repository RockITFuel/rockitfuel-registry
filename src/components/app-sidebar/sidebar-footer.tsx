import type { JSX } from "solid-js";

type SidebarFooterProps = {
  children: JSX.Element;
};

export default function SidebarFooter(props: SidebarFooterProps) {
  return <div class="w-full flex-none">{props.children}</div>;
}
