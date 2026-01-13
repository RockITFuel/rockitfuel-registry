import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils";

export function PageHeader(props: ComponentProps<"section">) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <section
      class={cn("flex flex-col items-start gap-2 pb-8", local.class)}
      {...others}
    >
      {local.children}
    </section>
  );
}

export function PageHeaderHeading(props: ComponentProps<"h1">) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h1
      class={cn(
        "font-bold text-3xl leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]",
        local.class
      )}
      {...others}
    />
  );
}

export function PageHeaderDescription(props: ComponentProps<"p">) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <p
      class={cn("max-w-2xl text-lg text-muted-foreground", local.class)}
      {...others}
    />
  );
}

export function PageHeaderActions(props: ComponentProps<"div">) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex w-full items-center justify-start gap-2 py-2",
        local.class
      )}
      {...others}
    />
  );
}
