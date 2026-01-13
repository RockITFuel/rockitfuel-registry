import { XIcon } from "lucide-solid";
import type { Component, ComponentProps, JSX } from "solid-js";
import { createEffect, createSignal, Show, splitProps } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { cn } from "~/lib/utils";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

const SuperInput: Component<
  ComponentProps<"input"> & {
    label?: string;
    error?: string;
    name: string;
    wrapperClass?: string;
    labelClass?: string;
    errorClass?: string;
    clearable?: boolean;
    icon?: JSX.Element;
  }
> = (props) => {
  const [local, others] = splitProps(props, [
    "type",
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "clearable",
    "icon",
  ]);

  const [ref, setRef] = createSignal<HTMLInputElement>();
  const [value, setValue] = createSignal("");

  createEffect(() => {
    const inputRef = ref();
    if (inputRef) {
      setValue(inputRef?.value);

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setValue(target?.value);
      };

      inputRef.addEventListener("input", handleInput);
      // Return cleanup function
      return () => {
        inputRef.removeEventListener("input", handleInput);
      };
    }
  });

  const dispatchInputEvent = () => {
    //https://github.com/fabian-hiller/modular-forms/issues/221#issuecomment-2212450429
    const input = document.getElementById(
      `${others.name}-super-input`
    ) as HTMLInputElement;
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  const inputId = () => `${others.name}-super-input`;

  return (
    <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
      <SuperLabel
        label={local.label}
        name={inputId()}
        required={others.required}
      />
      <div class="relative">
        <Show when={local.icon}>
          <div class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            {local.icon}
          </div>
        </Show>
        <input
          aria-errormessage={`${props.name}-error`}
          aria-invalid={!!props.error}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            local.class,
            local.error && "!ring-red-500 ring-2",
            local.icon && "pl-9"
          )}
          id={inputId()}
          ref={setRef}
          type={local.type ?? "text"}
          {...others}
        />
        <Presence>
          <Show when={local.clearable && value()?.length > 0}>
            <Motion.button
              animate={{ opacity: 1, scale: 1 }}
              class="absolute top-2 right-3 -translate-y-1/2 rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
              exit={{ opacity: 0, scale: 0.6 }}
              initial={{ opacity: 0, scale: 0.6 }}
              onClick={() => {
                if (ref()) {
                  ref()!.value = "";
                  setValue("");
                  dispatchInputEvent();
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              transition={{ duration: 0.3 }}
              type="button"
            >
              <XIcon class="size-4" />
            </Motion.button>
          </Show>
        </Presence>
      </div>
      <SuperError error={props.error} name={inputId()} />
    </div>
  );
};

export default SuperInput;
