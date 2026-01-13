import { Edit, LoaderCircle, Plus } from "lucide-solid";
import { createMemo, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { DialogTrigger } from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils/shadcn";

type Settings = {
  text?: string;
  showText?: boolean;
  tooltipText?: string;
  showTooltip?: boolean;
};

type Props = {
  isAddMode: boolean;
  isLoading: boolean;
  onClick?: () => void;
  edit?: Settings;
  add?: Settings;
  isIcon?: boolean;
};

export default function UpsertDialogTrigger(_props: Props) {
  const props = createMemo(
    () =>
      ({
        ..._props,
        add: _props?.add ?? {
          text: "Toevoegen",
          showText: true,
          tooltipText: "Toevoegen",
          showTooltip: false,
        },
        edit: _props?.edit ?? {
          text: "Bewerken",
          showText: true,
          tooltipText: "Bewerken",
          showTooltip: false,
        },
      }) satisfies Props
  );
  return (
    <DialogTrigger onClick={props().onClick}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={props().isIcon ? "icon" : "default"}
            variant={props().isAddMode ? "default" : "ghost"}
          >
            <Show
              fallback={
                props().isAddMode ? (
                  <Plus class={cn("size-4", props().add.showText && "mr-2")} />
                ) : (
                  <Edit class={cn("size-4", props().edit.showText && "mr-2")} />
                )
              }
              when={props().isLoading}
            >
              <LoaderCircle
                class={cn(
                  "size-4 animate-spin",
                  (props().isAddMode
                    ? props()?.add?.showText
                    : props()?.edit?.showText) && "mr-2"
                )}
              />
            </Show>
            {props()?.isAddMode
              ? props()?.add?.showText && props()?.add?.text
              : props()?.edit.showText && props()?.edit.text}
          </Button>
        </TooltipTrigger>
        <Show
          when={
            props().isAddMode
              ? props().add.showTooltip
              : props().edit.showTooltip
          }
        >
          <TooltipContent>
            {props().isAddMode
              ? props().add.tooltipText
              : props().edit.tooltipText}
          </TooltipContent>
        </Show>
      </Tooltip>
    </DialogTrigger>
  );
}
