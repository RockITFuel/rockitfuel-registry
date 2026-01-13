import { PanelLeft } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { useSidebar } from "./sidebar-provider";

export function SidebarTrigger() {
  const { toggle } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <PanelLeft class="h-4 w-4" />
    </Button>
  );
}
