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
        <div class="py-8 text-center">
          <Show
            fallback={
              <LoaderCircle class="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
            }
            when={props.icon}
          >
            {props.icon}
          </Show>
          <h3 class="mb-2 font-medium text-lg">{props.title || "Laden..."}</h3>
          <p class="text-muted-foreground">
            {props.description || "Even geduld, we halen de gegevens op."}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
