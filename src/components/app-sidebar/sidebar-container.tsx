import { createSignal, JSX, onMount, Show } from "solid-js";
import { useSidebar } from "./sidebar-provider";
import { SidebarTrigger } from "./sidebar-trigger";
import { cn } from "~/lib/utils";

type SidebarContainerProps = {
  children: JSX.Element;
  appContent: JSX.Element;
  enableBreadcrumbs?: boolean;
};

const [breadcrumbs, setBreadcrumbs] = createSignal<JSX.Element>(<></>);

export default function SidebarContainer(props: SidebarContainerProps) {
  const { isOpen, isMobile, close } = useSidebar();

  const handleBackdropClick = () => {
    if (isMobile()) {
      close();
    }
  };

  return (
    <div class="flex flex-row w-full h-screen relative">
      {/* Mobile Backdrop Overlay */}
      <Show when={isMobile() && isOpen()}>
        <div
          class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      </Show>

      {/* Sidebar */}
      <div
        class={cn(
          "flex flex-col h-screen transition-all duration-300 bg-background",
          // Mobile: fixed overlay from left
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          // Width and visibility
          isOpen()
            ? "w-72"
            : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"
        )}
      >
        {props.children}
      </div>

      {/* Main Content Area */}
      <div class="flex-1 h-screen p-2 overflow-y-auto">
        <div class="min-h-full w-full bg-card dark:bg-card rounded-2xl shadow-md dark:shadow-none dark:border dark:border-border flex flex-col">
          <div class="border-b border-border py-3 px-3 flex items-center gap-4">
            <SidebarTrigger />
            <div class="w-full">
              <span class="text-base font-medium text-foreground" data-testid="page-title">
                {breadcrumbs()}
              </span>
            </div>
          </div>
          {props.appContent}
        </div>
      </div>
    </div>
  );
}

export function SideNavBarBreadcrumb(props: { children: JSX.Element }) {
  onMount(() => {
    setBreadcrumbs(props.children);
  });
  return null;
}
