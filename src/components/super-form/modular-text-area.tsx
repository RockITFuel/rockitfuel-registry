import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import { ModularLabel } from "./modular-label";

const ModularTextArea: Component<
  Omit<ComponentProps<"textarea">, "value" | "error"> & {
    value?: ComponentProps<"textarea">["value"] | null;
    label?: string;
    error?: string;
    name: string;
    wrapperClass?: string;
    labelClass?: string;
    errorClass?: string;
    disableResize?: boolean;
  }
> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "disableResize",
  ]);

  const textAreaId = () => `${others.name}-modular-text-area`;

  return (
    <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
      <ModularLabel
        label={local.label}
        name={textAreaId()}
        required={others.required}
      />
      <textarea
        aria-errormessage={`${textAreaId()}-error`}
        aria-invalid={!!props?.error}
        class={cn(
          "flex min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          local.class,
          local?.error && "!ring-red-500 ring-2",
          local.disableResize && "resize-none"
        )}
        id={textAreaId()}
        {...others}
        value={props.value ?? ""}
      />
      <Expandable expanded={!!props?.error}>
        <div class={cn("mt-1 text-red-500 text-sm", local.errorClass)}>
          {props.error}
        </div>
      </Expandable>
    </div>
  );
};

export { ModularTextArea };
