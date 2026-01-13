import { makePersisted } from "@solid-primitives/storage";
import {
  Accessor,
  createContext,
  createSignal,
  onCleanup,
  onMount,
  ParentProps,
  useContext,
} from "solid-js";

const [isOpen, setIsOpen] = makePersisted(createSignal(true), {
  name: "sidebar-open",
});

function useProviderValue() {
  const [isMobile, setIsMobile] = createSignal(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  onMount(() => {
    // Mobile detection using matchMedia
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    // Keyboard shortcut: Cmd/Ctrl + B
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    onCleanup(() => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("keydown", handleKeydown);
    });
  });

  return {
    isOpen,
    setIsOpen,
    toggle,
    close,
    isMobile: isMobile as Accessor<boolean>,
  };
}

export type ContextType = ReturnType<typeof useProviderValue>;

const SidebarContext = createContext<ContextType | undefined>(undefined);

export const SidebarProvider = (props: ParentProps) => {
  const value = useProviderValue();
  return (
    <SidebarContext.Provider value={value}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};
