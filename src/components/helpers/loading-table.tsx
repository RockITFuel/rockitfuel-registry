import { LoaderCircle } from "lucide-solid";
import { type JSX, Show } from "solid-js";
import { TableCell, TableRow } from "../ui/table";

export type LoadingTableProps = {
	title?: string;
	description?: string;
	icon?: JSX.Element;
};

export default function LoadingTableRow(props: LoadingTableProps) {
	return (
		<TableRow>
			<TableCell colSpan={999}>
				<div class="text-center py-8">
					<Show
						when={props.icon}
						fallback={
							<LoaderCircle class="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
						}
					>
						{props.icon}
					</Show>
					<h3 class="text-lg font-medium mb-2">{props.title || "Laden..."}</h3>
					<p class="text-muted-foreground">
						{props.description || "Even geduld, we halen de gegevens op."}
					</p>
				</div>
			</TableCell>
		</TableRow>
	);
}
