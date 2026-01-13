import * as CheckboxPrimitive from "@kobalte/core/checkbox";
import { type Component, type JSX, Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";

type CheckboxProps = {
	value?: any;
	required?: boolean | undefined;
	disabled?: boolean | undefined;
	defaultChecked?: boolean | undefined;
	disableToggleLabel?: boolean | undefined;
	ref?: (element: HTMLInputElement) => void;
	onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange?: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	onCheckedChange: (checked: boolean) => void;
	label?: string;
	helperText?: string;
	error?: string;
	name: string;
	wrapperClass?: string;
	labelClass?: string;
	errorClass?: string;
};

const SuperCheckbox: Component<CheckboxProps> = (props) => {
	const [extraProps, remainingProps] = splitProps(props, [
		"label",
		"helperText",
		"error",
		"wrapperClass",
		"labelClass",
		"errorClass",
	]);
	const [rootProps, inputProps] = splitProps(
		remainingProps,
		["name", "value", "required", "disabled"],
		["ref", "onInput", "onChange", "onBlur"],
	);

	return (
		<div class={cn(extraProps.wrapperClass)}>
			<div class="flex flex-row gap-x-3 space-y-0">
				<CheckboxPrimitive.Root
					class={cn("items-top group flex space-x-2 pt-0.5")}
					{...rootProps}
					checked={remainingProps?.value ?? false}
					disabled={props.disabled}
					onChange={(checked) => {
						props?.onCheckedChange(checked);
					}}
				>
					<CheckboxPrimitive.Input
						id={`${rootProps.name}-super-checkbox`}
						{...rootProps}
						{...inputProps}
						disabled={props.disabled}
						onChange={remainingProps.onChange}
						type="checkbox"
					/>
					<CheckboxPrimitive.Control
						class={cn(
							"peer size-4 shrink-0 cursor-pointer rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-none data-[checked]:bg-primary data-[checked]:text-primary-foreground",
							props.disabled && "cursor-not-allowed opacity-50",
						)}
						id={`${rootProps.name}-super-checkbox-control`}
					>
						<CheckboxPrimitive.Indicator
							id={`${rootProps.name}-super-checkbox-indicator`}
						>
							<svg
								class="size-4"
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="Checked"
								role="img"
							>
								<path d="M5 12l5 5l10 -10" />
							</svg>
						</CheckboxPrimitive.Indicator>
					</CheckboxPrimitive.Control>
				</CheckboxPrimitive.Root>
				<div class="leading-none">
					<Show when={!!props.label}>
						<p
							class={cn(
								"font-medium text-sm",
								remainingProps?.onCheckedChange ? "cursor-pointer" : "",
								props.disabled && "cursor-not-allowed opacity-50",
								extraProps.labelClass,
							)}
							onClick={() => {
								if (
									remainingProps?.value !== undefined &&
									!props.disableToggleLabel &&
									!props.disabled
								) {
									remainingProps?.onCheckedChange?.(!remainingProps.value);
								}
							}}
						>
							{props.label}
						</p>
					</Show>
					<Show when={!!props.helperText}>
						<p class="mt-1 text-muted-foreground text-sm">{props.helperText}</p>
					</Show>
				</div>
			</div>
			<Expandable expanded={!!extraProps.error}>
				<div class={cn("mt-1 text-red-500 text-sm", extraProps.errorClass)}>
					{extraProps.error}
				</div>
			</Expandable>
		</div>
	);
};

export default SuperCheckbox;
