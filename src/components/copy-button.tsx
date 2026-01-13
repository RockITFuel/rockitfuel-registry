import { createSignal } from "solid-js";
import { toast } from "solid-sonner";
import { IconCheck, IconCopy } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type CopyButtonProps = {
  value: string;
  class?: string;
  label?: string;
};

export function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = createSignal(false);

  const copy = async () => {
    await navigator.clipboard.writeText(props.value);
    setCopied(true);
    toast.success(props.label ?? "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      class={cn("h-8 px-2", props.class)}
      onClick={copy}
      size="sm"
      variant="ghost"
    >
      {copied() ? <IconCheck class="size-4" /> : <IconCopy class="size-4" />}
      <span class="sr-only">Copy</span>
    </Button>
  );
}
