import { SearchXIcon } from "lucide-solid";
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
        <div class="py-8 text-center">
          <Show
            fallback={
              <SearchXIcon class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            }
            when={props.icon}
          >
            {props.icon}
          </Show>
          <h3 class="mb-2 font-medium text-lg">
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
