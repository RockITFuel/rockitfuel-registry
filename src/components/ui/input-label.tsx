import { Show } from "solid-js";
import { cn } from "~/lib/utils";

type InputLabelProps = {
  /**
   * The ID of the form control this label is associated with.
   * This must match the id attribute of the form control.
   */
  name: string;
  /**
   * The visible label text
   */
  label?: string;
  /**
   * Whether the associated form control is required
   */
  required?: boolean;
  /**
   * Additional CSS classes for the label element
   */
  class?: string;
  /**
   * Additional CSS classes for the required indicator
   */
  requiredClass?: string;
  /**
   * Whether the associated form control is disabled
   */
  disabled?: boolean;
};

/**
 * Accessible input label for a form field.
 *
 * @example
 * ```tsx
 * <InputLabel
 *   for="email"
 *   label="Email Address"
 *   required={true}
 * />
 * <input
 *   id="email"
 *   name="email"
 * />
 * <div id="email-hint">Please enter your work email</div>
 * ```
 */
export function InputLabel(props: InputLabelProps) {
  return (
    <Show when={props.label}>
      <label
        aria-disabled={props.disabled}
        class={cn(
          "flex items-center font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          props.disabled && "text-muted-foreground",
          props.class
        )}
        for={props.name}
      >
        {props.label}

        <Show when={props.required}>
          <span
            aria-hidden="true" // since it's decorative (screen readers will use aria-required on the label instead)
            class={cn(
              "cursor-help p-1 text-red-600 dark:text-red-400",
              props.requiredClass
            )}
            title="Verplicht veld"
          >
            *
          </span>
        </Show>
      </label>
    </Show>
  );
}
