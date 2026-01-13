import { useColorMode } from "@kobalte/core";
import { SunMoonIcon } from "lucide-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "~/components/ui/dropdown-menu";

/**
 * Simplified SidebarUser component - theme toggle only.
 * Auth-related features removed for registry demo.
 */
export default function SidebarUser() {
  const { setColorMode, colorMode } = useColorMode();

  return (
    <DropdownMenu placement="right-end">
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        class="w-full h-12 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] group border border-transparent hover:border-accent/20 hover:shadow-md"
      >
        <div class="flex items-center gap-3 w-full">
          <SunMoonIcon class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span class="text-sm font-medium">Theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-fit bg-card dark:bg-popover border-border">
        <DropdownMenuGroup>
          <DropdownMenuSub overlap>
            <DropdownMenuSubTrigger>
              <SunMoonIcon class="h-4 w-4 mr-2" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={colorMode()}
                  onChange={(value) =>
                    setColorMode(value as "system" | "dark" | "light")
                  }
                >
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark Mode
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">
                    Light Mode
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
