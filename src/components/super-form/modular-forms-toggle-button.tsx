import * as ButtonPrimitive from "@kobalte/core/button";
import { type Component, type JSX, Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

type ToggleButtonProps = {
  value?: boolean;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  defaultPressed?: boolean | undefined;
  ref?: (element: HTMLInputElement) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  onPressedChange: (pressed: boolean) => void;
  label?: string;
  helperText?: string;
  error?: string;
  name: string;
  wrapperClass?: string;
  labelClass?: string;
  errorClass?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  text?: string;
  icon?: Component<JSX.IntrinsicElements["svg"]>;
  children?: JSX.Element;
  selectedColor?: string;
};

const ModularFormsToggleButton: Component<ToggleButtonProps> = (props) => {
  const [extraProps, remainingProps] = splitProps(props, [
    "label",
    "helperText",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "variant",
    "size",
    "text",
    "icon",
    "children",
    "selectedColor",
  ]);
  const [rootProps, inputProps] = splitProps(
    remainingProps,
    ["name", "value", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"]
  );

  const isPressed = () => remainingProps?.value ?? false;
  const inputId = () => `${rootProps.name}-toggle-button-input`;

  const buttonVariantClasses = () => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variant = extraProps.variant ?? "outline";
    const size = extraProps.size ?? "default";

    const variantClasses = {
      default: isPressed()
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      outline: isPressed()
        ? "border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
        : "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: isPressed()
        ? "bg-accent text-accent-foreground"
        : "hover:bg-accent hover:text-accent-foreground",
      secondary: isPressed()
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8",
      icon: "size-10",
    };

    return cn(base, variantClasses[variant], sizeClasses[size]);
  };

  return (
    <div class={cn("w-full items-center space-y-1.5", extraProps.wrapperClass)}>
      <SuperLabel
        class={extraProps.labelClass}
        label={extraProps.label}
        name={inputId()}
        required={rootProps.required}
      />
      <div class="flex flex-col gap-1">
        <input
          {...inputProps}
          checked={isPressed()}
          class="sr-only"
          disabled={props.disabled}
          id={inputId()}
          name={rootProps.name}
          onChange={(e) => {
            const checked = (e.target as HTMLInputElement).checked;
            remainingProps?.onPressedChange?.(checked);
            inputProps.onChange?.(e);
          }}
          required={rootProps.required}
          type="checkbox"
        />
        <ButtonPrimitive.Root
          aria-errormessage={props.error ? `${inputId()}-error` : undefined}
          aria-invalid={!!props.error}
          aria-pressed={isPressed()}
          class={cn(
            buttonVariantClasses(),
            props.error && "!ring-red-500 ring-2",
            props.disabled && "cursor-not-allowed opacity-50"
          )}
          data-pressed={isPressed()}
          disabled={props.disabled}
          onClick={() => {
            if (!props.disabled) {
              const newValue = !isPressed();
              remainingProps?.onPressedChange?.(newValue);
              // Trigger change event on hidden input for modular forms
              const input = document.getElementById(
                inputId()
              ) as HTMLInputElement;
              if (input) {
                input.checked = newValue;
                input.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }
          }}
          style={
            extraProps.selectedColor && isPressed()
              ? { "background-color": extraProps.selectedColor }
              : undefined
          }
          type="button"
        >
          {extraProps.children ? (
            extraProps.children
          ) : (
            <>
              {extraProps.icon && (
                <extraProps.icon
                  class={cn(
                    "size-4 shrink-0",
                    extraProps.text && extraProps.size !== "icon" && "mr-2"
                  )}
                />
              )}
              {extraProps.text && <span>{extraProps.text}</span>}
            </>
          )}
        </ButtonPrimitive.Root>
        <Show when={!!extraProps.helperText}>
          <p class="text-muted-foreground text-sm">{extraProps.helperText}</p>
        </Show>
      </div>
      <SuperError
        class={extraProps.errorClass}
        error={extraProps.error}
        name={inputId()}
      />
    </div>
  );
};

export default ModularFormsToggleButton;
