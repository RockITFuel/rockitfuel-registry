import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type HeadingProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export function H1(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h1 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}

export function H2(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h2 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}

export function H3(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h3 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}

export function H4(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h4 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}

export function H5(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h5 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}

export function H6(props: HeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <h6 class={cn("scroll-mt-20", local.class)} data-toc="" {...rest} />;
}
