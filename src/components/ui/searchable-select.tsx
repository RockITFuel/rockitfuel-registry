import { Check, ChevronDown, Search, X } from "lucide-solid";
import MiniSearch from "minisearch";
import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  on,
  Show,
} from "solid-js";
import { cn } from "~/lib/utils";
import { getColorStyles } from "~/lib/utils/color";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Test ID prefix for Playwright
const TEST_ID_PREFIX = "searchable-select";

export type SearchableSelectOption<T> = T;

export type SearchableSelectProps<T> = {
  /** Array of options to display */
  options: T[];
  /** Current selected value (single mode) or values (multiple mode) */
  value?: T | T[];
  /** Callback when selection changes */
  onChange?: (value: T | T[] | undefined) => void;

  /** Key to use as the unique identifier for each option */
  optionValue?: keyof T;
  /** Key to use as the display label for each option */
  optionLabel?: keyof T;
  /** Key to use for chip color (hex, rgb, hsl) */
  optionColor?: keyof T;
  /** Key to check if option is disabled */
  optionDisabled?: keyof T;

  /** Enable multiple selection mode with chips */
  multiple?: boolean;
  /** Enable search functionality (default: true) */
  searchable?: boolean;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Custom empty state when no results found */
  emptyState?: JSX.Element;

  /** Additional class for the root container */
  class?: string;
  /** Additional class for the trigger button */
  triggerClass?: string;
  /** Additional class for the popover content */
  contentClass?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Base test ID for Playwright (will be prefixed with searchable-select-) */
  testId?: string;
};

export function SearchableSelect<T>(props: SearchableSelectProps<T>) {
  const [open, setOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [highlightedIndex, setHighlightedIndex] = createSignal(0);

  let searchInputRef: HTMLInputElement | undefined;
  let listRef: HTMLDivElement | undefined;

  // Generate test IDs
  const baseTestId = () =>
    props.testId ? `${TEST_ID_PREFIX}-${props.testId}` : TEST_ID_PREFIX;

  // Determine if options are objects or primitives
  const isObjectOptions = createMemo(
    () =>
      props.options.length > 0 &&
      typeof props.options[0] === "object" &&
      props.options[0] !== null
  );

  // Get the value of an option
  const getOptionValue = (option: T): string => {
    if (isObjectOptions() && props.optionValue) {
      return String(option[props.optionValue]);
    }
    return String(option);
  };

  // Get the label of an option
  const getOptionLabel = (option: T): string => {
    if (isObjectOptions() && props.optionLabel) {
      return String(option[props.optionLabel]);
    }
    return String(option);
  };

  // Get the color of an option
  const getOptionColor = (option: T): string | undefined => {
    if (isObjectOptions() && props.optionColor) {
      const color = option[props.optionColor];
      return typeof color === "string" ? color : undefined;
    }
    return;
  };

  // Check if an option is disabled
  const isOptionDisabled = (option: T): boolean => {
    if (isObjectOptions() && props.optionDisabled) {
      return Boolean(option[props.optionDisabled]);
    }
    return false;
  };

  // Create MiniSearch instance
  const miniSearch = createMemo(() => {
    const ms = new MiniSearch<{ id: string; label: string; index: number }>({
      fields: ["label"],
      storeFields: ["id", "label", "index"],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
      },
    });

    const documents = props.options.map((option, index) => ({
      id: getOptionValue(option),
      label: getOptionLabel(option),
      index,
    }));

    ms.addAll(documents);
    return ms;
  });

  // Filter options based on search query
  const filteredOptions: Accessor<T[]> = createMemo(() => {
    const query = searchQuery().trim();

    if (!query || props.searchable === false) {
      return props.options;
    }

    const results = miniSearch().search(query);
    return results.map((result) => props.options[result.index]);
  });

  // Check if an option is selected
  const isSelected = (option: T): boolean => {
    const optionVal = getOptionValue(option);

    if (props.multiple) {
      const values = props.value as T[] | undefined;
      if (!(values && Array.isArray(values))) return false;
      return values.some((v) => getOptionValue(v) === optionVal);
    }

    if (props.value === undefined || props.value === null) return false;
    return getOptionValue(props.value as T) === optionVal;
  };

  // Handle option selection
  const handleSelect = (option: T) => {
    if (isOptionDisabled(option)) return;

    if (props.multiple) {
      const currentValues = (props.value as T[] | undefined) || [];
      const optionVal = getOptionValue(option);
      const isCurrentlySelected = currentValues.some(
        (v) => getOptionValue(v) === optionVal
      );

      if (isCurrentlySelected) {
        // Remove from selection
        const newValues = currentValues.filter(
          (v) => getOptionValue(v) !== optionVal
        );
        props.onChange?.(newValues);
      } else {
        // Add to selection
        props.onChange?.([...currentValues, option]);
      }
    } else {
      props.onChange?.(option);
      setOpen(false);
    }
  };

  // Remove a chip in multiple mode
  const handleRemoveChip = (option: T, e: MouseEvent) => {
    e.stopPropagation();
    if (props.multiple) {
      const currentValues = (props.value as T[] | undefined) || [];
      const optionVal = getOptionValue(option);
      const newValues = currentValues.filter(
        (v) => getOptionValue(v) !== optionVal
      );
      props.onChange?.(newValues);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    const options = filteredOptions();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        scrollToHighlighted();
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        scrollToHighlighted();
        break;
      case "Enter":
        e.preventDefault();
        if (options[highlightedIndex()]) {
          handleSelect(options[highlightedIndex()]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view
  const scrollToHighlighted = () => {
    if (listRef) {
      const highlighted = listRef.querySelector('[data-highlighted="true"]');
      highlighted?.scrollIntoView({ block: "nearest" });
    }
  };

  // Reset search and highlighted index when popover opens
  createEffect(
    on(open, (isOpen) => {
      if (isOpen) {
        setSearchQuery("");
        setHighlightedIndex(0);
        // Focus search input when popover opens
        setTimeout(() => searchInputRef?.focus(), 0);
      }
    })
  );

  // Reset highlighted index when search changes
  createEffect(
    on(searchQuery, () => {
      setHighlightedIndex(0);
    })
  );

  // Render the trigger content
  const renderTriggerContent = () => {
    if (props.multiple) {
      const values = (props.value as T[] | undefined) || [];
      if (values.length === 0) {
        return (
          <span class="text-muted-foreground">
            {props.placeholder || "Select..."}
          </span>
        );
      }

      return (
        <div class="flex flex-wrap gap-1">
          <For each={values}>
            {(option) => {
              const color = getOptionColor(option);
              const colorStyles = color ? getColorStyles(color) : undefined;

              return (
                <span
                  class={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm",
                    !colorStyles && "bg-primary/10 text-primary"
                  )}
                  data-testid={`${baseTestId()}-chip-${getOptionValue(option)}`}
                  style={colorStyles}
                >
                  {getOptionLabel(option)}
                  <button
                    aria-label={`Remove ${getOptionLabel(option)}`}
                    class="rounded-sm p-0.5 hover:bg-black/10"
                    data-testid={`${baseTestId()}-chip-remove-${getOptionValue(option)}`}
                    onClick={(e) => handleRemoveChip(option, e)}
                    type="button"
                  >
                    <X class="size-3" />
                  </button>
                </span>
              );
            }}
          </For>
        </div>
      );
    }

    // Single select mode
    if (props.value === undefined || props.value === null) {
      return (
        <span class="text-muted-foreground">
          {props.placeholder || "Select..."}
        </span>
      );
    }

    return <span>{getOptionLabel(props.value as T)}</span>;
  };

  return (
    <Popover onOpenChange={setOpen} open={open()}>
      <PopoverTrigger
        as="button"
        class={cn(
          "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          props.multiple && "h-auto",
          props.triggerClass,
          props.class
        )}
        data-testid={`${baseTestId()}-trigger`}
        disabled={props.disabled}
        type="button"
      >
        <div class="flex-1 text-left">{renderTriggerContent()}</div>
        <ChevronDown class="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        class={cn("w-[var(--kb-popper-anchor-width)] p-0", props.contentClass)}
        data-testid={`${baseTestId()}-content`}
        onKeyDown={handleKeyDown}
      >
        <div class="flex flex-col">
          {/* Search Input */}
          <Show when={props.searchable !== false}>
            <div class="flex items-center border-b px-3">
              <Search class="mr-2 size-4 shrink-0 opacity-50" />
              <input
                class="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                data-testid={`${baseTestId()}-search`}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                placeholder={props.searchPlaceholder || "Search..."}
                ref={searchInputRef}
                type="text"
                value={searchQuery()}
              />
            </div>
          </Show>

          {/* Options List */}
          {/* biome-ignore lint/a11y/useSemanticElements: custom listbox implementation */}
          <div
            class="max-h-60 overflow-y-auto p-1"
            data-testid={`${baseTestId()}-listbox`}
            ref={listRef}
            role="listbox"
          >
            <Show
              fallback={
                <div
                  class="py-6 text-center text-muted-foreground text-sm"
                  data-testid={`${baseTestId()}-empty`}
                >
                  {props.emptyState || "Geen resultaten gevonden"}
                </div>
              }
              when={filteredOptions().length > 0}
            >
              <For each={filteredOptions()}>
                {(option, index) => {
                  const selected = () => isSelected(option);
                  const highlighted = () => highlightedIndex() === index();
                  const disabled = isOptionDisabled(option);

                  return (
                    <button
                      aria-selected={selected()}
                      class={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        highlighted() && "bg-accent text-accent-foreground",
                        disabled && "pointer-events-none opacity-50"
                      )}
                      data-highlighted={highlighted()}
                      data-testid={`${baseTestId()}-option-${getOptionValue(option)}`}
                      disabled={disabled}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index())}
                      role="option"
                      type="button"
                    >
                      <span
                        class={cn(
                          "mr-2 flex size-4 items-center justify-center",
                          !selected() && "opacity-0"
                        )}
                      >
                        <Check class="size-4" />
                      </span>
                      <span>{getOptionLabel(option)}</span>
                    </button>
                  );
                }}
              </For>
            </Show>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableSelect;
