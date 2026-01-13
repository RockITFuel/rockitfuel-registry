import { XIcon } from "lucide-solid";
import {
	type ComponentProps,
	createEffect,
	createMemo,
	createSignal,
	For,
	on,
	Show,
	splitProps,
} from "solid-js";
import {
	Select,
	SelectContent,
	SelectHiddenSelect,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { getColorStyles } from "~/lib/utils/color";
import { Expandable } from "../helpers/expandable";
import { SuperLabel } from "./super-label";

export const ModularFormsSelect = <T,>(
	props: ComponentProps<"select"> & {
		label?: string;
		error?: string;
		name: string;
		options: T[];
		placeholder?: string;
		optionValue?: string;
		optionTextValue?: string;
		optionDisabled?: string;
		optionColor?: string;
		class?: string;
		labelClass?: string;
		errorClass?: string;
		required?: boolean;
		requiredClass?: string;
		multiple?: boolean;
		wrapperClass?: string;
		"data-testid"?: string;
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
		"data-testid",
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

	const [value, setValue] = createSignal<T | T[] | undefined>(
		getInitialValue(),
	);

	const isObject = createMemo(() => {
		return typeof props.options[0] === "object";
	});

	const itemLabel = (item: T) => {
		if (isObject()) {
			return <>{item[props.optionTextValue as keyof T]}</>;
		}
		return String(item);
	};

	const itemValue = (item: T) => {
		if (isObject()) {
			return String(item[props.optionValue as keyof T]);
		}
		return String(item);
	};

	// Ref for hidden input in multiple mode
	let hiddenInputRef: HTMLInputElement | undefined;

	// Sync external value changes (from modular-forms) to internal state
	createEffect(
		on(
			() => props.value,
			(externalValue) => {
				if (externalValue !== undefined) {
					(setValue as any)(getInitialValue());
				}
			},
		),
	);

	// Trigger input event when value changes (for multiple mode)
	createEffect(
		on(value, () => {
			if (local.multiple && hiddenInputRef) {
				// Trigger input event to notify modular-forms
				const event = new Event("input", { bubbles: true });
				hiddenInputRef.dispatchEvent(event);
			}
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
			<Select
				multiple={local.multiple}
				value={value() as any}
				onChange={setValue as any}
				name={props.name}
				options={props.options}
				optionValue={props.optionValue as any}
				optionTextValue={props.optionTextValue as any}
				optionDisabled={props.optionDisabled as any}
				placeholder={props.placeholder || "Select an option..."}
				itemComponent={(itemProps) => (
					<SelectItem item={itemProps.item}>
						{itemLabel(itemProps.item.rawValue as T)}
					</SelectItem>
				)}
			>
				<Show
					when={!local.multiple}
					fallback={
						// For multiple selection, use comma-separated values
						<input
							{...(others as ComponentProps<"input">)}
							ref={hiddenInputRef}
							type="hidden"
							value={((value() as T[]) || [])
								.map((item) => itemValue(item))
								.join(",")}
						/>
					}
				>
					<SelectHiddenSelect {...others} />
				</Show>
				<SelectTrigger
					aria-label={props.label || props.name}
					class={cn(
						"w-full",
						local.multiple && "h-auto min-h-10 py-2",
						local.class,
					)}
					data-testid={local["data-testid"]}
				>
					<SelectValue<T>
						class={cn(
							"w-full text-left",
							others.value === "" && "text-muted-foreground",
						)}
					>
						{(state) => {
							if (local.multiple) {
								const selectedOptions = state.selectedOptions() as T[];
								return (
									<Show when={selectedOptions.length > 0}>
										<div class="flex flex-wrap gap-1">
											<For each={selectedOptions}>
												{(option) => {
													const colorValue =
														option[props.optionColor as keyof T];
													const colorStyles =
														colorValue && typeof colorValue === "string"
															? getColorStyles(colorValue)
															: undefined;
													const hasValidColor = !!colorStyles;

													return (
														<span
															class={cn(
																"inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm",
																!hasValidColor && "bg-primary/10 text-primary",
															)}
															style={colorStyles}
															onPointerDown={(e) => e.stopPropagation()}
														>
															{itemLabel(option)}
															<button
																type="button"
																class="hover:bg-primary/20 rounded-sm p-0.5"
																onClick={(e) => {
																	e.stopPropagation();
																	state.remove(option);
																}}
																aria-label={`Remove ${itemLabel(option)}`}
															>
																<XIcon class="size-4" />
															</button>
														</span>
													);
												}}
											</For>
										</div>
									</Show>
								);
							}
							return itemLabel(state.selectedOption() as T);
						}}
					</SelectValue>
					<Show when={local.multiple && (value() as T[])?.length > 0}>
						<button
							type="button"
							class="hover:bg-muted rounded-sm p-1"
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => {
								e.stopPropagation();
								(setValue as any)([] as T[]);
							}}
							aria-label="Clear all selections"
						>
							<XIcon class="size-4" />
						</button>
					</Show>
				</SelectTrigger>
				<SelectContent />
			</Select>
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
