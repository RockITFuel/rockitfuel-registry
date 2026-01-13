import { useColorMode } from "@kobalte/core";
import { SunMoonIcon } from "lucide-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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
        class="group h-12 w-full rounded-xl border border-transparent px-4 py-3 transition-all duration-300 hover:scale-[1.02] hover:border-accent/20 hover:shadow-md"
        variant="ghost"
      >
        <div class="flex w-full items-center gap-3">
          <SunMoonIcon class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          <span class="font-medium text-sm">Theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-fit border-border bg-card dark:bg-popover">
        <DropdownMenuGroup>
          <DropdownMenuSub overlap>
            <DropdownMenuSubTrigger>
              <SunMoonIcon class="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  onChange={(value) =>
                    setColorMode(value as "system" | "dark" | "light")
                  }
                  value={colorMode()}
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
