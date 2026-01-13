import { type FormStore, remove } from "@modular-forms/solid";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-solid";
import {
	createEffect,
	createMemo,
	createSignal,
	For,
	type JSX,
	Show,
	splitProps,
} from "solid-js";
import { useBindSignal } from "~/hooks/use-bind-signal";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import { Button } from "../ui/button";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

type FileInputProps = {
	ref: (element: HTMLInputElement) => void;
	name: string;
	value?: File[] | File;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	accept?: string;
	required?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	errorClass?: string;
	labelClass?: string;
	wrapperClass?: string;
	formStore: FormStore<any, any>;
	onNestedItemRemove: (index: number) => void;
	class?: string;
	label?: string;
	error?: string;
	defaultValueLabel?: string;
};

/**
 * File input field that users can click or drag files into. Various
 * decorations can be displayed in or around the field to communicate the entry
 * requirements.
 */
export function FileInputList(props: FileInputProps) {
	const [expanded, setExpanded] = useBindSignal({
		value: () => false,
	});

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
	// Split input element props
	const [otherProps, inputProps] = splitProps(props, [
		"class",
		"value",
		"label",
		"error",
		"wrapperClass",
		"labelClass",
		"errorClass",
		"defaultValueLabel",
	]);

	// Create file list
	const getFiles = createMemo(() =>
		props.value
			? Array.isArray(props.value)
				? props.value
				: [props.value]
			: [],
	);

	createEffect(() => {
		if (getFiles().length > 1) {
			setExpanded(true);
		}
	});

	return (
		<div class={clsx("space-y-1.5", props.wrapperClass)}>
			<SuperLabel
				class={props.labelClass}
				label={props.label}
				name={props.name}
				required={props.required}
			/>
			<div
				class={clsx(
					"relative flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					!getFiles().length && "text-slate-500",
					inputProps.disabled
						? "cursor-not-allowed opacity-50"
						: "cursor-pointer",
					props.class,
				)}
				onClick={() => inputRef()?.click()}
			>
				{otherProps.defaultValueLabel ?? (
					<>Klik of sleep een bestand{props.multiple && "en"}</>
				)}
				<input
					{...inputProps}
					aria-errormessage={`${props.name}-error`}
					aria-invalid={!!props.error}
					class="absolute top-0 left-0 hidden h-full w-full opacity-0"
					id={props.name}
					ref={setInputRef}
					type="file"
				/>
			</div>
			<Expandable expanded={getFiles().length > 1}>
				{/* <Expandable expanded={getFiles().length > 0}> */}
				<Button
					class={cn("w-full justify-between")}
					onclick={() => setExpanded(!expanded())}
					variant="ghost"
				>
					<span> Bekijk bestanden</span>{" "}
					<Show
						fallback={<ChevronDownIcon class="ml-2 size-4" />}
						when={expanded()}
					>
						<ChevronUpIcon class="ml-2 size-4" />
					</Show>
				</Button>
				<Show when={expanded()}>
					<hr />
				</Show>
			</Expandable>
			<Expandable expanded={expanded()}>
				<div class="flex max-h-[200px] flex-col gap-2 overflow-y-auto px-2">
					<For each={getFiles()}>
						{(file, index) => (
							<div class="flex justify-between">
								<span>{file.name}</span>
								<Button
									onclick={() => {
										console.log(`remove ${props.name} at ${index()}`);
										remove(props.formStore, props.name, { at: index() });
										props.onNestedItemRemove(index());
									}}
									size="icon"
									type="button"
									variant="ghost"
								>
									<TrashIcon class="size-4" />
								</Button>
							</div>
						)}
					</For>
				</div>
			</Expandable>

			<SuperError
				class={props.errorClass}
				error={props.error}
				name={props.name}
			/>
		</div>
	);
}
