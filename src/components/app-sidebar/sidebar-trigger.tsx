import { PanelLeft } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { useSidebar } from "./sidebar-provider";

export function SidebarTrigger() {
  const { toggle } = useSidebar();
  return (
    <Button onClick={toggle} size="icon" variant="ghost">
      <PanelLeft class="h-4 w-4" />
    </Button>
  );
}
