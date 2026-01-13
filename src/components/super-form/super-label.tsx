import { Show } from "solid-js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
  class?: string;
  requiredClass?: string;
};

/**
 * Input label for a form field.
 */
export function SuperLabel(props: InputLabelProps) {
  return (
    <Show when={props.label}>
      <label
        class={cn(
          "flex items-center font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          props.class
        )}
        for={props.name}
      >
        {props.label}

        <Show when={props.required}>
          <Tooltip>
            <TooltipTrigger tabIndex={-1} type="button">
              <span
                class={cn(
                  "ml-1 text-red-600 dark:text-red-400",
                  props.requiredClass
                )} // Make the span not focusable
                tabIndex={-1}
              >
                *
              </span>
            </TooltipTrigger>
            <TooltipContent>Verplicht</TooltipContent>
          </Tooltip>
        </Show>
      </label>
    </Show>
  );
}
