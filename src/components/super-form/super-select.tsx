import { createAsync } from "@solidjs/router";
import {
  type ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  on,
  splitProps,
} from "solid-js";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SuperLabel } from "./super-label";

type SuperSelectPropsBase<T> = Omit<ComponentProps<"input">, "value"> & {
  value?: ComponentProps<"input">["value"] | null;
  label?: string;
  onValueChange?: (v: T | null) => void;
  autoSelectFirstOption?: boolean;
  optionValue?: string;
  optionTextValue?: string;
  optionDisabled?: string;
  error?: string;
  placeholder?: string;
  name: string;
  wrapperClass?: string;
  labelClass?: string;
  errorClass?: string;
};

type SuperSelectPropsWithOptions<T> = SuperSelectPropsBase<T> & {
  options: any[];
  queryFn?: never; // Ensure queryFn is not provided when options are provided
};

type SuperSelectPropsWithQueryFn<T> = SuperSelectPropsBase<T> & {
  queryFn: (params: { where?: any }) => Promise<any[]>;
  queryFnParams?: { where?: any };
  options?: never; // Ensure options is not provided when queryFn is provided
};

type SuperSelectProps<T> =
  | SuperSelectPropsWithOptions<T>
  | SuperSelectPropsWithQueryFn<T>;

const SuperSelect = <T,>(props: SuperSelectProps<T>): JSX.Element => {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "queryFn",
    "options",
    "optionValue",
    "optionTextValue",
    "optionDisabled",
    "autoSelectFirstOption",
    "wrapperClass",
    "labelClass",
    "errorClass",
  ]);

  const [value, setValue] = createSignal<any>();
  const getValue = createMemo(() => {
    if (value() === undefined) return;
    return value()![local.optionValue ?? "value"];
  });
  const [initialValue, setInitialValue] = createSignal<string | undefined>(
    (props.value as string) ?? undefined
  );

  const cacheOptions = createAsync(
    local.queryFn !== undefined ? () => local.queryFn!({}) : async () => [],
    {
      initialValue: [],
      deferStream: false,
    }
  );

  const [options, SetOptions] = createSignal<any[]>(
    local.queryFn ? cacheOptions() : (local.options ?? [])
  );

  createEffect(() => {
    setInitialValue((props.value as string) ?? undefined);
  });

  createEffect(
    on(cacheOptions, () => {
      if (cacheOptions() === undefined || cacheOptions()!.length === 0) return;
      SetOptions(cacheOptions()!);
    })
  );

  createEffect(
    on(options, () => {
      if (options() === undefined || options().length === 0) return;
      if (!getValue() && initialValue() !== undefined) {
        const found = options()!.find(
          (option) => option[local.optionValue ?? "value"] === initialValue()
        );
        if (found !== undefined) {
          setValue(found);
          //https://github.com/fabian-hiller/modular-forms/issues/221#issuecomment-2212450429
          const input = document.getElementById(
            `${others.name}-super-select`
          ) as HTMLInputElement;
          input.dispatchEvent(
            new Event("input", { bubbles: true, composed: true })
          );
        }
        setInitialValue(undefined);
      }
    })
  );

  return (
    <>
      <input
        {...others}
        class="!h-0"
        id={`${others.name}-super-select`}
        type="hidden"
        value={getValue()}
      />
      <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
        <SuperLabel
          label={local.label}
          name={others.name}
          required={others.required}
        />
        <Select
          disabled={others.disabled}
          itemComponent={(props: any) => (
            <SelectItem item={props.item}>{props.item.textValue}</SelectItem>
          )}
          name={others.name}
          onChange={(e: any) => {
            if (e === null || e === "") return;
            setValue(e);
            if (props.onValueChange) {
              props.onValueChange(e.target.value);
            }
            //https://github.com/fabian-hiller/modular-forms/issues/221#issuecomment-2212450429
            const input = document.getElementById(
              `${others.name}-super-select`
            ) as HTMLInputElement;
            if (input)
              input.dispatchEvent(
                new Event("input", { bubbles: true, composed: true })
              );

            if (input)
              input.dispatchEvent(
                new Event("change", { bubbles: true, composed: true })
              );
          }}
          options={options()}
          optionTextValue={local.optionTextValue ?? "label"}
          optionValue={local.optionValue ?? "value"}
          placeholder={others.placeholder}
          value={value()}
        >
          <SelectTrigger
            aria-label={`${others.name}-select`}
            class={cn(
              "w-full",
              local.class,
              local.error && "!ring-red-500 ring-2"
            )}
          >
            <SelectValue<any>>
              {(state: any) => {
                if (state.selectedOption() === undefined) return "";
                return state.selectedOption()[local.optionTextValue ?? "label"];
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <Expandable expanded={!!props.error}>
          <div class={cn("mt-1 text-red-500 text-sm", local.errorClass)}>
            {props.error}
          </div>
        </Expandable>
      </div>
    </>
  );
};

export default SuperSelect;
