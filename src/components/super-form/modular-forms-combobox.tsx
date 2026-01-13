import debounce from "debounce";
import {
	type ComponentProps,
	createEffect,
	createMemo,
	createSignal,
	on,
	splitProps,
} from "solid-js";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import {
	Combobox,
	ComboboxContent,
	ComboboxControl,
	ComboboxHiddenSelect,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxItemLabel,
	ComboboxTrigger,
} from "../ui/combobox";
import { SuperLabel } from "./super-label";

export const ModularFormsCombobox = <T,>(
	props: ComponentProps<"select"> & {
		label?: string;
		error?: string;
		name: string;
		options: T[];
		placeholder?: string;
		optionValue?: string;
		optionTextValue?: string;
		optionDisabled?: string;
		class?: string;
		labelClass?: string;
		errorClass?: string;
		required?: boolean;
		requiredClass?: string;
		multiple?: boolean;
		wrapperClass?: string;
		onInputOverride?: (value: string) => void;
		disableFilter?: boolean;
	},
) => {
	const [local, others] = splitProps(props, [
		"label",
		"error",
		"class",
		"labelClass",
		"errorClass",
		"required",
		"requiredClass",
		"options",
		"placeholder",
		"optionValue",
		"optionTextValue",
		"optionDisabled",
		"multiple",
		"wrapperClass",
		"onInputOverride",
		"disableFilter",
	]);
	const getInitialValue = () => {
		const value = props.value;

		if (local.multiple) {
			// Handle multiple selection - value should be an array or comma-separated string
			const values = Array.isArray(value)
				? value
				: typeof value === "string" && value
					? value.split(",")
					: [];

			if (typeof props.options[0] === "object") {
				return props.options.filter((option) =>
					values.includes(String(option[props.optionValue as keyof T])),
				);
			}
			return props.options.filter((option) => values.includes(String(option)));
		}

		// Handle single selection
		if (typeof props.options[0] === "object") {
			const res = props.options.find(
				(option) => option[props.optionValue as keyof T] === value,
			);
			return res;
		}
		const res = props.options.find((option) => option === value);
		return res;
	};

	const [value, setValue] = createSignal<T | T[] | null>(
		getInitialValue() ?? null,
	);

	const isObject = createMemo(() => {
		return typeof props.options[0] === "object";
	});

	const itemLabel = (item: T) => {
		if (!item) return "";

		if (isObject()) {
			return String(item[props.optionTextValue as keyof T]);
		}
		return String(item);
	};

	const itemValue = (item: T) => {
		if (!item) return null;

		if (isObject()) {
			return String(item[props.optionValue as keyof T]);
		}
		return String(item);
	};

	// Ref for hidden input in multiple mode
	let hiddenInputRef: HTMLInputElement | undefined;

	// // Sync external value changes (from modular-forms) to internal state
	// createEffect(
	// 	on(
	// 		() => props.value,
	// 		(externalValue) => {
	// 			if (externalValue !== undefined) {
	// 				(setValue as any)(getInitialValue());
	// 			}
	// 		},
	// 	),
	// );

	// Trigger input event when value changes (for multiple mode)
	createEffect(
		on(value, (value) => {
			console.log("[value] value", value);
			if (value) {
				console.log("[value] value", value);
				setInputValue(itemLabel(value as T));
			}
			// if (local.multiple && hiddenInputRef) {
			// 	// Trigger input event to notify modular-forms
			// 	const event = new Event("input", { bubbles: true });
			// 	hiddenInputRef.dispatchEvent(event);
			// }
		}),
	);

	/**
	 * Input override vars
	 */
	const [inputValue, setInputValue] = createSignal("");
	const [query, setQuery] = createSignal("");
	const [debouncedQuery, setDebouncedQuery] = createSignal("");

	// Create debounced function with 500ms delay
	const debouncedSetQuery = debounce((value: string) => {
		setDebouncedQuery(value);
	}, 500);

	// Update debounced query when query changes
	createEffect(
		on(query, (value) => {
			console.log("[query] value", value);
			debouncedSetQuery(value);
			if (value === "") {
				setValue(null);
			}
		}),
	);

	createEffect(
		on(debouncedQuery, (value) => {
			local.onInputOverride?.(value);
		}),
	);

	return (
		<div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
			<SuperLabel
				label={local.label}
				name={others.name}
				required={local.required}
				class={local.labelClass}
				requiredClass={local.requiredClass}
			/>
			<Combobox
				value={value() as any}
				onChange={(newValue) => {
					console.log("[onChange] value", newValue);
					if (value() !== null && newValue === null) {
						setInputValue("");
					}
					setValue((newValue as any) ?? null);
				}}
				name={props.name}
				options={props.options}
				optionValue={props.optionValue as any}
				optionTextValue={props.optionTextValue as any}
				optionLabel={props.optionTextValue as any}
				optionDisabled={props.optionDisabled as any}
				placeholder={props.placeholder || "Select an option..."}
				onInputChange={(value) => {
					if (typeof value === "string" && value !== "[object Object]") {
						setQuery(value);
					}
				}}
				defaultFilter={local.disableFilter ? () => true : undefined}
				itemComponent={(props) => (
					<ComboboxItem item={props.item}>
						<ComboboxItemLabel>
							{itemLabel(props.item.rawValue as T)}
						</ComboboxItemLabel>
						<ComboboxItemIndicator />
					</ComboboxItem>
				)}
			>
				<ComboboxHiddenSelect {...others} />
				<ComboboxControl aria-label="Fruit">
					<ComboboxInput
						onInput={(e) => {
							console.log(
								"[onInput] value",
								(e.target as HTMLInputElement).value,
							);
							setInputValue((e.target as HTMLInputElement).value);
						}}
						value={inputValue()}
					/>
					<ComboboxTrigger />
				</ComboboxControl>
				<ComboboxContent />
			</Combobox>
			<Expandable expanded={!!props.error}>
				<div
					class={cn("text-sm text-red-500 mt-1", local.errorClass)}
					id={`${others.name}-error`}
				>
					{local.error}
				</div>
			</Expandable>
		</div>
	);
};
