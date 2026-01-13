import { JSX } from "solid-js";

type SidebarFooterProps = {
  children: JSX.Element;
};

export default function SidebarFooter(props: SidebarFooterProps) {
  return <div class="flex-none w-full">{props.children}</div>;
}
