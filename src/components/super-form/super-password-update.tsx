import { EyeIcon, EyeOffIcon } from "lucide-solid";
import type { Component, ComponentProps } from "solid-js";
import { createEffect, createSignal, Show, splitProps } from "solid-js";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

const SuperPasswordUpdate: Component<
  ComponentProps<"input"> & {
    label?: string;
    error?: string;
    name: string;
    wrapperClass?: string;
    labelClass?: string;
    errorClass?: string;
    isEdit?: boolean;
    helpText?: string;
  }
> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "isEdit",
    "helpText",
  ]);

  const [ref, setRef] = createSignal<HTMLInputElement>();
  const [showPassword, setShowPassword] = createSignal(false);
  const [hasBeenFocused, setHasBeenFocused] = createSignal(false);
  const [currentValue, setCurrentValue] = createSignal("");

  // Set initial value for edit mode
  createEffect(() => {
    const inputRef = ref();
    if (inputRef && local.isEdit && !hasBeenFocused()) {
      inputRef.value = "********";
      setCurrentValue("********");
    }
  });

  const dispatchInputEvent = () => {
    const input = document.getElementById(
      `${others.name}-super-password-update`
    ) as HTMLInputElement;
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  };

  const handleFocus = () => {
    const inputRef = ref();
    if (inputRef && local.isEdit && !hasBeenFocused()) {
      inputRef.value = "";
      setCurrentValue("");
      setHasBeenFocused(true);
      dispatchInputEvent();
    }
  };

  const handleBlur = () => {
    const inputRef = ref();
    if (inputRef && local.isEdit && hasBeenFocused() && inputRef.value === "") {
      inputRef.value = "********";
      setCurrentValue("********");
      dispatchInputEvent();
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCurrentValue(target.value);
  };

  const inputId = () => `${others.name}-super-password-update`;

  return (
    <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
      <SuperLabel
        label={local.label}
        name={inputId()}
        required={others.required}
      />
      <div class="relative">
        <input
          aria-errormessage={`${props.name}-error`}
          aria-invalid={!!props.error}
          class={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-20 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            local.class,
            local.error && "!ring-red-500 ring-2"
          )}
          id={inputId()}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleInput}
          ref={setRef}
          type={showPassword() ? "text" : "password"}
          {...others}
        />
        <Button
          class="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          disabled={others.disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Show when={showPassword()}>
            <EyeIcon aria-hidden="true" class="h-4 w-4" />
          </Show>
          <Show when={!showPassword()}>
            <EyeOffIcon aria-hidden="true" class="h-4 w-4" />
          </Show>
          <span class="sr-only">
            {showPassword() ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      <Show when={local.helpText}>
        <p class="text-muted-foreground text-sm">{local.helpText}</p>
      </Show>
      <SuperError error={props.error} name={inputId()} />
    </div>
  );
};

export default SuperPasswordUpdate;
