import { createShortcut } from "@solid-primitives/keyboard";
import { ZoomIn, ZoomOut } from "lucide-solid";
import { createEffect, createSignal, type JSX, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useBindSignal } from "~/hooks/use-bind-signal";
import { cn } from "~/lib/utils";

export default function ImagePreviewDialog(props: {
  imageUrl?: string;
  name?: string;
  imgClass?: string;
  fallbackClass?: string;
  children?: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  let zoomInButtonRef: HTMLButtonElement | undefined;
  let zoomOutButtonRef: HTMLButtonElement | undefined;
  let resetZoomButtonRef: HTMLButtonElement | undefined;
  let scrollContainer: HTMLDivElement | undefined;

  const [open, setOpen] = useBindSignal({
    value: () => props.open,
    setValue: (value) => {
      props.onOpenChange?.(value ?? false);
    },
  });
  const [imageError, setImageError] = useBindSignal({
    value: () => !props.imageUrl,
  });
  const [zoom, setZoom] = createSignal(1);

  const zoomIn = () => {
    zoomInButtonRef?.focus();
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    zoomOutButtonRef?.focus();
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const resetZoom = () => {
    resetZoomButtonRef?.focus();
    setZoom(1);
    if (scrollContainer) {
      scrollContainer.scrollLeft = 0;
      scrollContainer.scrollTop = 0;
    }
  };

  const scrollStep = 100; // pixels to scroll per arrow key press
  let scrollInterval: ReturnType<typeof setInterval> | undefined;

  const scrollLeft = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft - scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollUp = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop - scrollStep,
        behavior: "smooth",
      });
    }
  };

  const scrollDown = () => {
    if (scrollContainer && zoom() > 1) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + scrollStep,
        behavior: "smooth",
      });
    }
  };

  const startContinuousScroll = (scrollFunction: () => void) => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    scrollFunction(); // Initial scroll
    scrollInterval = setInterval(scrollFunction, 100); // Continue every 100ms
  };

  const stopContinuousScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = undefined;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open()) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        startContinuousScroll(scrollLeft);
        break;
      case "ArrowRight":
        e.preventDefault();
        startContinuousScroll(scrollRight);
        break;
      case "ArrowUp":
        e.preventDefault();
        startContinuousScroll(scrollUp);
        break;
      case "ArrowDown":
        e.preventDefault();
        startContinuousScroll(scrollDown);
        break;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!open()) return;

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      stopContinuousScroll();
    }
  };

  // Add keyboard event listeners when dialog is open
  createEffect(() => {
    if (open()) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        stopContinuousScroll();
      };
    }
  });

  // Keyboard shortcuts using solid-primitives (excluding arrow keys)
  createShortcut(["+"], zoomIn, { preventDefault: false });
  createShortcut(["="], zoomIn, { preventDefault: false });
  createShortcut(["-"], zoomOut, { preventDefault: false });
  createShortcut(["0"], resetZoom, { preventDefault: false });

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetZoom();
        }
      }}
      open={open()}
    >
      <DialogTrigger>
        <Show fallback={props.children} when={!props.children}>
          <div class="cursor-pointer transition-opacity hover:opacity-75">
            <Show
              fallback={
                <div
                  class={cn(
                    "flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-gray-500 text-xs",
                    props.fallbackClass
                  )}
                >
                  Geen afbeelding
                </div>
              }
              when={!imageError()}
            >
              <img
                alt={props.name}
                class={cn("h-12 w-12 rounded object-cover", props.imgClass)}
                onError={(err) => {
                  setImageError(true);
                }}
                src={props.imageUrl}
              />
            </Show>
          </div>
        </Show>
      </DialogTrigger>
      <DialogContent class="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Afbeelding - {props.name}</DialogTitle>
        </DialogHeader>

        {/* Zoom Controls */}
        <div class="mb-4 flex justify-center gap-2">
          <Button
            disabled={zoom() <= 0.25}
            onClick={zoomOut}
            ref={zoomOutButtonRef}
            size="sm"
            variant="outline"
          >
            <ZoomOut size={16} />
          </Button>

          <Button
            onClick={resetZoom}
            ref={resetZoomButtonRef}
            size="sm"
            variant="outline"
          >
            {Math.round(zoom() * 100)}%
          </Button>

          <Button
            disabled={zoom() >= 5}
            onClick={zoomIn}
            ref={zoomInButtonRef}
            size="sm"
            variant="outline"
          >
            <ZoomIn size={16} />
          </Button>
        </div>

        <div
          class="flex max-h-[60vh] justify-center overflow-auto p-4"
          ref={scrollContainer}
        >
          <Show
            fallback={
              <div class="flex h-96 w-96 items-center justify-center rounded bg-gray-200 text-gray-500">
                Afbeelding kan niet geladen worden
              </div>
            }
            when={!imageError()}
          >
            <img
              alt={props.name}
              class="max-h-full max-w-full rounded object-contain transition-transform duration-200"
              onError={() => setImageError(true)}
              src={props.imageUrl}
              style={`transform: scale(${zoom()});`}
            />
          </Show>
        </div>

        <div class="mt-2 text-center text-muted-foreground text-sm">
          Gebruik +/- toetsen om in/uit te zoomen, 0 om te resetten
          <Show when={zoom() > 1}>
            <span>, pijltjestoetsen om te scrollen of scroll met de muis</span>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  );
}
