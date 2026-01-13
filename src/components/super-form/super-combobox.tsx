import type { ComboboxTriggerMode } from "@kobalte/core/combobox";
import { XIcon } from "lucide-solid";
import {
	type ComponentProps,
	createEffect,
	createMemo,
	type JSX,
	on,
	Show,
	splitProps,
} from "solid-js";
import { Motion, Presence } from "solid-motionone";
import { useBindSignal } from "~/hooks/use-bind-signal";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import {
	Combobox,
	ComboboxContent,
	ComboboxControl,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxItemLabel,
	ComboboxTrigger,
} from "../ui/combobox";
import { SuperLabel } from "./super-label";

type SuperComboboxPropsBase = Omit<ComponentProps<"input">, "value"> & {
	value?: ComponentProps<"input">["value"] | null;
	label?: string;
	clearable?: boolean;
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
	triggerMode?: ComboboxTriggerMode;
};

type SuperComboboxPropsWithOptions<T> = SuperComboboxPropsBase & {
	options: T[];
	lastActionOptions?: (T & { action: (v: T) => void; icon?: JSX.Element })[];
	firstActionOptions?: (T & { action: (v: T) => void; icon?: JSX.Element })[];
	onValueChange: (v: T | null) => void; // Required because playwright doesnt support synthetic input events
	idSuffix?: string;
};

type SuperComboboxProps<T> = SuperComboboxPropsWithOptions<T>;

const SuperCombobox = <T,>(props: SuperComboboxProps<T>) => {
	const [local, others] = splitProps(props, [
		"class",
		"label",
		"clearable",
		"error",
		"options",
		"optionValue",
		"optionTextValue",
		"optionDisabled",
		"autoSelectFirstOption",
		"wrapperClass",
		"labelClass",
		"errorClass",
		"triggerMode",
	]);

	const options = createMemo(() => [
		...(props.firstActionOptions ?? []),
		...(local.options ?? []),
		...(props.lastActionOptions ?? []),
	]);

	// This make sure that state is updated when the value in changed
	const [getValue, setValue] = useBindSignal({
		value: () => {
			const opts = options();
			if (!(opts && Array.isArray(opts))) return;
			const optionKey = local.optionValue ?? "value";
			return opts.find((option) => {
				if (!option || typeof option !== "object") return false;
				// @ts-expect-error
				return option[optionKey] === props.value;
			});
		},
	});

	createEffect(
		on([options, () => props.value], () => {
			if (options() === undefined) return;
			if (getValue() === undefined && props.value !== undefined) {
				const found = options()!.find(
					// @ts-expect-error ts(7053)
					(option) => option[local.optionValue ?? "value"] === props.value,
				);
				if (found !== undefined) {
					// @ts-expect-error ts(7053)
					setValue(found);
				}
			}
			if (
				local.autoSelectFirstOption &&
				options().length > 0 &&
				getValue() === undefined &&
				props.value === undefined
			) {
				// @ts-expect-error ts(7053)
				setValue(options()[0]);
			}
		}),
	);

	const dispatchInputEvent = () => {
		//https://github.com/fabian-hiller/modular-forms/issues/221#issuecomment-2212450429

		//This doesnt work with playwright though
		//Need to have a onValueChange prop that is called when the value is changed
		const input = document.getElementById(
			`${others.name}-super-combobox`,
		) as HTMLInputElement;
		input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	};

	const idSuffic = () =>
		props.idSuffix ? `${others.idSuffix}-${props.name}` : others.name;

	return (
		<>
			<div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
				<SuperLabel
					label={local.label}
					name={others.name}
					required={others.required}
				/>
				<Combobox
					disabled={others.disabled}
					itemComponent={(props) => (
						<ComboboxItem
							data-test-id={`${idSuffic()}-super-combobox-item-${props.item.textValue}`}
							item={props.item}
						>
							<ComboboxItemLabel class="flex items-center gap-2">
								{(props.item.rawValue as any)?.icon &&
									(props.item.rawValue as any).icon}
								{props.item.textValue}
							</ComboboxItemLabel>
							<ComboboxItemIndicator />
						</ComboboxItem>
					)}
					onChange={(e) => {
						if (e && typeof e === "object" && "action" in e) {
							// Performs the action of the lastActionOptions
							// @ts-expect-error
							e.action(e);
						} else {
							// Sets the value of the combobox
							// @ts-expect-error
							setValue(e);
							props.onValueChange(e as T);

							console.log("sended values: ", e);
						}
					}}
					// @ts-expect-error
					optionLabel={local.optionTextValue ?? "label"}
					// @ts-expect-error
					options={options()}
					// @ts-expect-error
					optionTextValue={local.optionTextValue ?? "label"}
					optionValue={local.optionValue ?? "value"}
					// value={getValue()}
					triggerMode={local.triggerMode}
					value={getValue()}
				>
					<ComboboxControl
						aria-label={local.label}
						class={cn(local.error && "!ring-red-500 ring-2")}
					>
						{(state) => (
							<>
								<ComboboxInput
									id={`${idSuffic()}-super-combobox-input`}
									onInput={(e) => {
										//@ts-expect-error
										// setUISearchValue(e.target.value);
									}}
								/>
								<Presence>
									<Show when={local.clearable && getValue()}>
										<Motion.button
											animate={{ opacity: 1, scale: 1 }}
											class="rounded-full p-1 hover:bg-accent hover:text-accent-foreground"
											exit={{ opacity: 0, scale: 0.6 }}
											initial={{ opacity: 0, scale: 0.6 }}
											onClick={() => {
												setValue(undefined);
												state.clear();
												dispatchInputEvent();
											}}
											onPointerDown={(e) => e.stopPropagation()}
											transition={{ duration: 0.3 }}
											type="button"
										>
											<XIcon class="size-4 opacity-50" />
										</Motion.button>
									</Show>
								</Presence>
								<ComboboxTrigger id={others.name} />
							</>
						)}
					</ComboboxControl>
					<ComboboxContent testIdSuffix={idSuffic()} />
				</Combobox>
				<Expandable expanded={!!props.error}>
					<div class={cn("mt-1 text-red-500 text-sm", local.errorClass)}>
						{props.error}
					</div>
				</Expandable>
			</div>
		</>
	);
};

export default SuperCombobox;
