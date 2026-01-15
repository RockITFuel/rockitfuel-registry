import { IconContract, IconExpand } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { isWidescreen, toggleWidescreen } from "~/stores/widescreen";

export function WidescreenToggle() {
  return (
    <Button
      class="w-9 px-0"
      onClick={toggleWidescreen}
      size="sm"
      title={isWidescreen() ? "Exit widescreen" : "Enter widescreen"}
      variant="ghost"
    >
      {isWidescreen() ? (
        <IconContract class="size-5" />
      ) : (
        <IconExpand class="size-5" />
      )}
      <span class="sr-only">Toggle widescreen</span>
    </Button>
  );
}
