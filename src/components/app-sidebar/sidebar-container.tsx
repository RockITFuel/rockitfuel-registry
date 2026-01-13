import { createSignal, type JSX, onMount, Show } from "solid-js";
import { cn } from "~/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { SidebarTrigger } from "./sidebar-trigger";

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
    <div class="relative flex h-screen w-full flex-row">
      {/* Mobile Backdrop Overlay */}
      <Show when={isMobile() && isOpen()}>
        <div
          aria-hidden="true"
          class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      </Show>

      {/* Sidebar */}
      <div
        class={cn(
          "flex h-screen flex-col bg-background transition-all duration-300",
          // Mobile: fixed overlay from left
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          // Width and visibility
          isOpen()
            ? "w-72"
            : "-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden"
        )}
      >
        {props.children}
      </div>

      {/* Main Content Area */}
      <div class="h-screen flex-1 overflow-y-auto p-2">
        <div class="flex min-h-full w-full flex-col rounded-2xl bg-card shadow-md dark:border dark:border-border dark:bg-card dark:shadow-none">
          <div class="flex items-center gap-4 border-border border-b px-3 py-3">
            <SidebarTrigger />
            <div class="w-full">
              <span
                class="font-medium text-base text-foreground"
                data-testid="page-title"
              >
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
