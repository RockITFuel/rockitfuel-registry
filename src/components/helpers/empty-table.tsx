import { CalendarIcon, PandaIcon, SearchXIcon } from "lucide-solid";
import { type JSX, Show } from "solid-js";
import { TableCell, TableRow } from "../ui/table";

export type EmptyTableProps = {
	title?: string;
	description?: string;
	icon?: JSX.Element;
};

export default function EmptyTableRow(props: EmptyTableProps) {
	return (
		<TableRow>
			<TableCell colSpan={999}>
				<div class="text-center py-8">
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
			</TableCell>
		</TableRow>
	);
}
