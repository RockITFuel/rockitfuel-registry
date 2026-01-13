import { JSX } from "solid-js";

type SidebarHeaderProps = {
  children: JSX.Element;
};

export default function SidebarHeader(props: SidebarHeaderProps) {
  return <div class="flex-none w-full">{props.children}</div>;
}
