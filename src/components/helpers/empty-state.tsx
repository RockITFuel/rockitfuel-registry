import { SearchXIcon } from "lucide-solid";
import { type JSX, Show } from "solid-js";

export type EmptyStateProps = {
	title?: string;
	description?: string;
	icon?: JSX.Element;
	class?: string;
};

export default function EmptyState(props: EmptyStateProps) {
	return (
		<div
			class={`flex flex-col items-center justify-center text-center ${props.class || ""}`}
		>
			<Show
				when={props.icon}
				fallback={
					<SearchXIcon class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
				}
			>
				{props.icon}
			</Show>
			<h3 class="text-lg font-medium mb-2">
				{props.title || "Geen resultaten gevonden"}
			</h3>
			<p class="text-muted-foreground">
				{props.description ||
					"Probeer je zoekopdracht aan te passen of check later terug."}
			</p>
		</div>
	);
}
