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
import { SearchableSelect } from "../ui/searchable-select";
import { SuperLabel } from "./super-label";

type SuperSearchableSelectPropsBase<T> = Omit<
	ComponentProps<"input">,
	"value" | "onChange"
> & {
	/** Current value - string ID for single, comma-separated IDs or array for multiple */
	value?: string | string[] | null;
	/** Label text */
	label?: string;
	/** Callback when value changes (receives the raw value, not the option object) */
	onValueChange?: (v: string | string[] | null) => void;
	/** Key to use as the unique identifier for each option */
	optionValue?: string;
	/** Key to use as the display label for each option */
	optionLabel?: string;
	/** Key to use for chip color (hex, rgb, hsl) */
	optionColor?: string;
	/** Key to check if option is disabled */
	optionDisabled?: string;
	/** Error message */
	error?: string;
	/** Placeholder text when no selection */
	placeholder?: string;
	/** Placeholder text for search input */
	searchPlaceholder?: string;
	/** Form field name (required) */
	name: string;
	/** Enable multiple selection mode */
	multiple?: boolean;
	/** Enable search functionality (default: true) */
	searchable?: boolean;
	/** Custom empty state when no results found */
	emptyState?: JSX.Element;
	/** Wrapper class */
	wrapperClass?: string;
	/** Label class */
	labelClass?: string;
	/** Error class */
	errorClass?: string;
	/** Trigger button class */
	triggerClass?: string;
	/** Content popover class */
	contentClass?: string;
};

type SuperSearchableSelectPropsWithOptions<T> =
	SuperSearchableSelectPropsBase<T> & {
		options: T[];
		queryFn?: never;
		queryFnParams?: never;
	};

type SuperSearchableSelectPropsWithQueryFn<T> =
	SuperSearchableSelectPropsBase<T> & {
		queryFn: (params: { where?: Record<string, unknown> }) => Promise<T[]>;
		queryFnParams?: { where?: Record<string, unknown> };
		options?: never;
	};

export type SuperSearchableSelectProps<T> =
	| SuperSearchableSelectPropsWithOptions<T>
	| SuperSearchableSelectPropsWithQueryFn<T>;

export function SuperSearchableSelect<T extends Record<string, unknown>>(
	props: SuperSearchableSelectProps<T>,
): JSX.Element {
	const [local, others] = splitProps(props, [
		"class",
		"label",
		"error",
		"queryFn",
		"queryFnParams",
		"options",
		"optionValue",
		"optionLabel",
		"optionColor",
		"optionDisabled",
		"multiple",
		"searchable",
		"emptyState",
		"placeholder",
		"searchPlaceholder",
		"wrapperClass",
		"labelClass",
		"errorClass",
		"triggerClass",
		"contentClass",
		"onValueChange",
	]);

	const optionValueKey = () => (local.optionValue ?? "value") as keyof T;
	const optionLabelKey = () => (local.optionLabel ?? "label") as keyof T;

	// Internal selected value state (stores option objects)
	const [selectedValue, setSelectedValue] = createSignal<T | T[] | undefined>(
		undefined,
	);

	// Track initial value for syncing
	const [initialValue, setInitialValue] = createSignal<
		string | string[] | null | undefined
	>(props.value ?? undefined);

	// Async options fetching
	const asyncOptions = createAsync(
		local.queryFn !== undefined
			? () => local.queryFn!(local.queryFnParams ?? {})
			: async () => [] as T[],
		{
			initialValue: [] as T[],
			deferStream: false,
		},
	);

	// Resolved options (from props or async)
	const [options, setOptions] = createSignal<T[]>(
		local.queryFn ? asyncOptions() : (local.options ?? []),
	);

	// Update initial value when prop changes
	createEffect(() => {
		setInitialValue(props.value ?? undefined);
	});

	// Update options when async options load
	createEffect(
		on(asyncOptions, () => {
			if (asyncOptions() && asyncOptions().length > 0) {
				setOptions(asyncOptions());
			}
		}),
	);

	// Sync initial value to selected value when options are available
	createEffect(
		on(options, () => {
			const opts = options();
			if (!opts || opts.length === 0) return;

			const initial = initialValue();
			if (initial === undefined || initial === null) return;

			if (local.multiple) {
				// Multiple mode: find all matching options
				const values = Array.isArray(initial)
					? initial
					: typeof initial === "string"
						? initial.split(",").filter(Boolean)
						: [];

				const found = opts.filter((opt) =>
					values.includes(String(opt[optionValueKey()])),
				);

				if (found.length > 0) {
					setSelectedValue(found);
					dispatchInputEvent();
				}
			} else {
				// Single mode: find matching option
				const found = opts.find(
					(opt) => String(opt[optionValueKey()]) === initial,
				);
				if (found) {
					setSelectedValue(() => found);
					dispatchInputEvent();
				}
			}

			setInitialValue(undefined);
		}),
	);

	// Get the value for the hidden input
	const getHiddenInputValue = createMemo(() => {
		const selected = selectedValue();
		if (selected === undefined) return "";

		if (local.multiple) {
			const values = selected as T[];
			return values.map((v) => String(v[optionValueKey()])).join(",");
		}

		return String((selected as T)[optionValueKey()]);
	});

	// Dispatch events to notify modular-forms
	const dispatchInputEvent = () => {
		const input = document.getElementById(
			`${others.name}-super-searchable-select`,
		) as HTMLInputElement;
		if (input) {
			input.dispatchEvent(
				new Event("input", { bubbles: true, composed: true }),
			);
			input.dispatchEvent(
				new Event("change", { bubbles: true, composed: true }),
			);
		}
	};

	// Handle selection change
	const handleChange = (value: T | T[] | undefined) => {
		setSelectedValue(() => value);
		dispatchInputEvent();

		// Call onValueChange with the raw value(s)
		if (local.onValueChange) {
			if (value === undefined) {
				local.onValueChange(null);
			} else if (local.multiple) {
				const values = value as T[];
				local.onValueChange(values.map((v) => String(v[optionValueKey()])));
			} else {
				local.onValueChange(String((value as T)[optionValueKey()]));
			}
		}
	};

	return (
		<>
			<input
				{...others}
				class="!h-0"
				id={`${others.name}-super-searchable-select`}
				type="hidden"
				value={getHiddenInputValue()}
			/>
			<div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
				<SuperLabel
					label={local.label}
					name={others.name}
					required={others.required}
					class={local.labelClass}
				/>
				<SearchableSelect<T>
					options={options()}
					value={selectedValue()}
					onChange={handleChange}
					optionValue={optionValueKey()}
					optionLabel={optionLabelKey()}
					optionColor={local.optionColor as keyof T}
					optionDisabled={local.optionDisabled as keyof T}
					multiple={local.multiple}
					searchable={local.searchable}
					placeholder={local.placeholder}
					searchPlaceholder={local.searchPlaceholder}
					emptyState={local.emptyState}
					disabled={others.disabled}
					class={cn(local.class, local.error && "!ring-red-500 ring-2")}
					triggerClass={local.triggerClass}
					contentClass={local.contentClass}
					testId={others.name}
				/>
				<Expandable expanded={!!local.error}>
					<div
						class={cn("mt-1 text-red-500 text-sm", local.errorClass)}
						id={`${others.name}-error`}
					>
						{local.error}
					</div>
				</Expandable>
			</div>
		</>
	);
}

export default SuperSearchableSelect;
