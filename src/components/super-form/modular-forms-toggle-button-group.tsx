import * as ButtonPrimitive from "@kobalte/core/button";
import {
	type Component,
	type ComponentProps,
	createEffect,
	For,
	on,
	Show,
	splitProps,
} from "solid-js";
import { cn } from "~/lib/utils";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

type ToggleButtonOption = {
	label?: string;
	labelIcon?: Component<JSX.IntrinsicElements["svg"]>;
	value: string | number | boolean;
	selectedColor?: string;
};

type ToggleButtonGroupProps = ComponentProps<"input"> & {
	label?: string;
	error?: string;
	name: string;
	options: ToggleButtonOption[];
	value?: (string | number | boolean)[];
	required?: boolean | undefined;
	disabled?: boolean | undefined;
	onValueChange: (value: (string | number | boolean)[]) => void;
	wrapperClass?: string;
	labelClass?: string;
	errorClass?: string;
	variant?: "default" | "outline" | "ghost" | "secondary";
	size?: "default" | "sm" | "lg" | "icon";
	orientation?: "horizontal" | "vertical";
	ref?: (element: HTMLInputElement) => void;
	onInput?: ComponentProps<"input">["onInput"];
	onChange?: ComponentProps<"input">["onChange"];
	onBlur?: ComponentProps<"input">["onBlur"];
};

const ModularFormsToggleButtonGroup: Component<ToggleButtonGroupProps> = (
	props,
) => {
	const [local, others] = splitProps(props, [
		"label",
		"error",
		"options",
		"value",
		"required",
		"disabled",
		"onValueChange",
		"wrapperClass",
		"labelClass",
		"errorClass",
		"variant",
		"size",
		"orientation",
	]);

	const [inputProps] = splitProps(others, [
		"ref",
		"onInput",
		"onChange",
		"onBlur",
	]);

	// Ref for hidden input
	let hiddenInputRef: HTMLInputElement | undefined;

	const isSelected = (optionValue: string | number | boolean) => {
		if (!local.value || local.value.length === 0) return false;
		// Check if the option value is in the array (with type coercion)
		return local.value.some(
			(val) => val === optionValue || String(val) === String(optionValue),
		);
	};

	const inputId = () => `${others.name}-toggle-button-group-input`;
	const groupId = () => `${others.name}-toggle-button-group`;

	// Sync value prop with hidden input (comma-separated for modular forms)
	createEffect(
		on(
			() => local.value,
			(values) => {
				if (!hiddenInputRef) return;
				const valueString = (values ?? []).map(String).join(",");
				// Only update if the value is actually different to prevent loops
				if (hiddenInputRef.value !== valueString) {
					hiddenInputRef.value = valueString;
					// Trigger input event to notify modular forms
					const event = new Event("input", { bubbles: true });
					hiddenInputRef.dispatchEvent(event);
				}
			},
		),
	);

	const buttonVariantClasses = (isPressed: boolean) => {
		const base =
			"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

		const variant = local.variant ?? "outline";
		const size = local.size ?? "default";

		const variantClasses = {
			default: isPressed
				? "bg-primary text-primary-foreground hover:bg-primary/90"
				: "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
			outline: isPressed
				? "border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
				: "border border-input hover:bg-accent hover:text-accent-foreground",
			ghost: isPressed
				? "bg-accent text-accent-foreground"
				: "hover:bg-accent hover:text-accent-foreground",
			secondary: isPressed
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

	const handleButtonClick = (optionValue: string | number | boolean) => {
		if (!local.disabled) {
			const currentValues = local.value ?? [];
			const isCurrentlySelected = isSelected(optionValue);

			// Toggle the value: remove if present, add if not present
			const newValues = isCurrentlySelected
				? currentValues.filter(
						(val) => val !== optionValue && String(val) !== String(optionValue),
					)
				: [...currentValues, optionValue];

			local.onValueChange(newValues);
			// The createEffect will handle syncing the hidden input and triggering events
		}
	};

	return (
		<div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
			<SuperLabel
				label={local.label}
				name={inputId()}
				required={local.required}
				class={local.labelClass}
			/>
			<div class="flex flex-col gap-1">
				{/* Hidden input for modular forms - comma-separated values for arrays */}
				<input
					{...inputProps}
					ref={hiddenInputRef}
					class="sr-only"
					disabled={local.disabled}
					id={inputId()}
					name={others.name}
					required={local.required}
					type="hidden"
					value={(local.value ?? []).map(String).join(",")}
					onChange={(e) => {
						// Only call the original onChange handler, don't update our state
						// The hidden input is read-only from modular forms' perspective
						inputProps.onChange?.(e);
					}}
				/>
				<div
					class={cn(
						"inline-flex overflow-auto",
						local.orientation === "vertical" ? "flex-col" : "flex-row",
						"[&>button]:rounded-none",
						"[&>button:first-child]:rounded-l-md",
						"[&>button:last-child]:rounded-r-md",
						local.orientation === "vertical" &&
							"[&>button:first-child]:rounded-t-md",
						local.orientation === "vertical" &&
							"[&>button:last-child]:rounded-b-md",
						local.orientation === "vertical" &&
							"[&>button:not(:last-child)]:rounded-b-none",
						local.orientation === "vertical" &&
							"[&>button:not(:first-child)]:rounded-t-none",
						local.orientation === "horizontal" &&
							"[&>button:not(:last-child)]:rounded-r-none",
						local.orientation === "horizontal" &&
							"[&>button:not(:first-child)]:rounded-l-none",
					)}
					id={groupId()}
					role="group"
					aria-label={local.label}
				>
					<For each={local.options}>
						{(option) => {
							const pressed = () => isSelected(option.value);
							return (
								<ButtonPrimitive.Root
									aria-pressed={pressed()}
									class={cn(
										buttonVariantClasses(pressed()),
										local.error && "!ring-red-500 ring-2",
										local.disabled && "cursor-not-allowed opacity-50",
									)}
									data-pressed={pressed()}
									disabled={local.disabled}
									style={
										option.selectedColor && pressed()
											? {
													"background-color": option.selectedColor,
													"border-color": option.selectedColor,
												}
											: undefined
									}
									onClick={() => handleButtonClick(option.value)}
									type="button"
								>
									{/* labelIcon takes precedence - if present, show only icon */}
									{option.labelIcon ? (
										<option.labelIcon class="size-4 shrink-0" />
									) : (
										/* Otherwise show label if present, or fall back to value */
										<span>{option.label ?? String(option.value)}</span>
									)}
								</ButtonPrimitive.Root>
							);
						}}
					</For>
				</div>
			</div>
			<SuperError
				error={local.error}
				name={inputId()}
				class={local.errorClass}
			/>
		</div>
	);
};

export default ModularFormsToggleButtonGroup;
