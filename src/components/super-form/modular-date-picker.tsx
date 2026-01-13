import type { DatePickerRootProps, DateValue } from "@ark-ui/solid/date-picker";
import { getWeek, isPast, isToday, isWeekend } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-solid";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
  For,
  Show,
  splitProps,
} from "solid-js";
import {
  DatePicker,
  DatePickerContext,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "~/components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useBindSignal } from "~/hooks/use-bind-signal";
import {
  dateStringToCalendarDate,
  formatDutchDate,
  parseDutchDateInput,
  toCalendarDateSafe,
} from "~/lib/date-utils";
import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";
import { Button } from "../ui/button";
import { ModularLabel } from "./modular-label";

type ModularDatePickerProps = Component<
  Omit<ComponentProps<"input">, "value"> & {
    value?: number | Date;
    label?: string;
    error?: string;
    name: string;
    wrapperClass?: string;
    labelClass?: string;
    errorClass?: string;
    min?: string;
    max?: string;
    clearButton?: boolean;
    onDateChange?: (value: Date) => void;
    datePickerRootProps?: DatePickerRootProps;
    /** Show ISO week numbers column */
    showWeekNumbers?: boolean;
    /** Disable Saturday and Sunday */
    disableWeekends?: boolean;
    /** Disable dates in the past */
    disablePast?: boolean;
    /** Disable today's date */
    disableToday?: boolean;
    /** ID prefix for form compatibility */
    prefixId?: string;
  }
>;

/**
 * ModularDatePicker component that seamlessly converts between JavaScript Date objects
 * (used by validation libraries) and @internationalized/date CalendarDate objects
 * (used by the Ark UI DatePicker component).
 *
 * Supports Dutch date format (dd-MM-yyyy) with flexible input parsing.
 * Users can type dates like "02022025" or "02-02-2025".
 *
 * @param min - The minimum date for the date picker in the format yyyy-mm-dd
 * @param max - The maximum date for the date picker in the format yyyy-mm-dd
 * @param value - Can accept either a JavaScript Date object or number (timestamp)
 * @param onDateChange - Callback that returns a JavaScript Date object
 * @param showWeekNumbers - Show ISO week numbers in the calendar
 * @param disableWeekends - Disable Saturday and Sunday selection
 * @param disablePast - Disable past dates selection
 * @param disableToday - Disable today's date selection
 *
 * @returns A date picker component with proper type conversions
 */
const ModularDatePicker: ModularDatePickerProps = (props) => {
  const [local, others] = splitProps(props, [
    "wrapperClass",
    "labelClass",
    "errorClass",
    "min",
    "max",
    "clearButton",
    "label",
    "class",
    "error",
    "onDateChange",
    "datePickerRootProps",
    "showWeekNumbers",
    "disableWeekends",
    "disablePast",
    "disableToday",
    "prefixId",
  ]);

  const [value, setValue] = useBindSignal<number | Date | undefined>({
    value: () => props.value,
  });

  const [datePickerOpen, setDatePickerOpen] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");
  const [hasInputError, setHasInputError] = createSignal(false);

  // Helper to get the Date object from the current value
  const getDateObject = createMemo((): Date | null => {
    const currentValue = value();
    if (!currentValue) {
      return null;
    }

    let dateValue: Date;
    if (typeof currentValue === "number") {
      dateValue = new Date(currentValue);
    } else if (typeof currentValue === "string") {
      dateValue = new Date(currentValue);
    } else {
      dateValue = currentValue;
    }

    if (Number.isNaN(dateValue.getTime())) {
      return null;
    }

    return dateValue;
  });

  // Format for display (Dutch format: dd-MM-yyyy)
  const getFormattedValue = createMemo(() => {
    const dateObj = getDateObject();
    if (!dateObj) return "";
    return formatDutchDate(dateObj);
  });

  // Format for form input (ISO format: yyyy-MM-dd)
  const getFormValueForInput = createMemo(() => {
    const dateObj = getDateObject();
    if (!dateObj) return "";
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Sync input value with formatted value when value changes externally
  const displayValue = createMemo(() => {
    // If user is typing, show their input, otherwise show formatted value
    const formatted = getFormattedValue();
    if (inputValue() === "" && formatted) {
      return formatted;
    }
    return inputValue() || formatted;
  });

  // Convert value to CalendarDate array for DatePicker
  const getDateValue = createMemo(() => {
    const currentValue = value();
    if (!currentValue) return [];

    const calendarDate = toCalendarDateSafe(currentValue);
    return calendarDate ? [calendarDate] : [];
  });

  // Convert min/max strings to CalendarDate
  const getMinDateValue = createMemo((): DateValue | undefined => {
    if (!local.min) return;
    try {
      return dateStringToCalendarDate(local.min);
    } catch {
      return;
    }
  });

  const getMaxDateValue = createMemo((): DateValue | undefined => {
    if (!local.max) return;
    try {
      return dateStringToCalendarDate(local.max);
    } catch {
      return;
    }
  });

  const inputId = () => {
    const prefix = local.prefixId ? `${local.prefixId}-` : "";
    return `${prefix}${props.name}-modular-date-picker`;
  };

  // Handle input changes (user typing)
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
    setHasInputError(false);
  };

  // Handle input blur - parse and validate the input
  const handleInputBlur = () => {
    const input = inputValue();

    // If empty, clear the value
    if (!input || input.trim() === "") {
      setInputValue("");
      setHasInputError(false);
      return;
    }

    // Try to parse the input
    const parsedDate = parseDutchDateInput(input);

    if (parsedDate) {
      // Check against min/max constraints
      const minDate = local.min ? new Date(local.min) : null;
      const maxDate = local.max ? new Date(local.max) : null;

      if (minDate && parsedDate < minDate) {
        setHasInputError(true);
        return;
      }

      if (maxDate && parsedDate > maxDate) {
        setHasInputError(true);
        return;
      }

      // Check disable constraints
      if (local.disableWeekends && isWeekend(parsedDate)) {
        setHasInputError(true);
        return;
      }

      if (local.disablePast && isPast(parsedDate) && !isToday(parsedDate)) {
        setHasInputError(true);
        return;
      }

      if (local.disableToday && isToday(parsedDate)) {
        setHasInputError(true);
        return;
      }

      // Valid date - update the value
      setValue(parsedDate);
      setInputValue(formatDutchDate(parsedDate));
      setHasInputError(false);
      local.onDateChange?.(parsedDate);

      // Dispatch input event for form libraries
      const inputElement = document.getElementById(
        inputId()
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.dispatchEvent(
          new Event("input", { bubbles: true, composed: true })
        );
      }
    } else {
      // Invalid date - show error and revert to last valid value
      setHasInputError(true);
      // Revert to formatted value on next tick
      setTimeout(() => {
        const formatted = getFormattedValue();
        if (formatted) {
          setInputValue(formatted);
          setHasInputError(false);
        }
      }, 1500);
    }
  };

  // Handle date selection from picker
  const handleValueChange = (details: {
    value: DateValue[];
    valueAsString: string[];
  }) => {
    if (details.value.length > 0 && details.value[0]) {
      const calendarDate = details.value[0];
      const newDate = calendarDate.toDate("Europe/Amsterdam");

      setValue(newDate);
      setInputValue(formatDutchDate(newDate));
      setHasInputError(false);
      local.onDateChange?.(newDate);

      // Dispatch input event for form libraries
      const inputElement = document.getElementById(
        inputId()
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.dispatchEvent(
          new Event("input", { bubbles: true, composed: true })
        );
      }
    }
    setDatePickerOpen(false);
  };

  // Handle clear button
  const handleClear = () => {
    setValue(undefined);
    setInputValue("");
    setHasInputError(false);

    const inputElement = document.getElementById(inputId()) as HTMLInputElement;
    if (inputElement) {
      inputElement.dispatchEvent(
        new Event("input", { bubbles: true, composed: true })
      );
    }
  };

  // Check if a date should be disabled
  const isDateDisabled = (day: DateValue): boolean => {
    const date = day.toDate("Europe/Amsterdam");
    if (local.disableWeekends && isWeekend(date)) return true;
    if (local.disablePast && isPast(date) && !isToday(date)) return true;
    if (local.disableToday && isToday(date)) return true;
    return false;
  };

  return (
    <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
      <ModularLabel
        label={local.label}
        name={others.name}
        required={others.required}
      />
      <div class="flex w-full space-x-0.5">
        <div class="relative w-full flex-1">
          {/* Hidden input for form library compatibility (receives form field props) */}
          <input
            {...others}
            aria-errormessage={`${props.name}-error`}
            aria-invalid={!!props.error}
            class="sr-only"
            id={inputId()}
            type="date"
            value={getFormValueForInput()}
          />

          {/* Visible text input for user interaction */}
          <input
            aria-invalid={!!props.error || hasInputError()}
            class={cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              local.class,
              (local.error || hasInputError()) && "!ring-red-500 ring-2"
            )}
            disabled={others.disabled}
            id={`${inputId()}-display`}
            onBlur={handleInputBlur}
            onInput={handleInputChange}
            placeholder="dd-mm-jjjj"
            type="text"
            value={displayValue()}
          />

          <Popover
            onOpenChange={setDatePickerOpen}
            open={datePickerOpen()}
            placement="bottom-end"
          >
            <PopoverTrigger
              as={Button}
              class="absolute top-1/2 right-1 -translate-y-1/2 hover:bg-transparent"
              disabled={others.disabled}
              id={`${inputId()}-trigger`}
              size="icon"
              variant="ghost"
            >
              <CalendarIcon class="h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent class="w-auto p-3">
              <DatePicker
                {...local.datePickerRootProps}
                closeOnSelect={false}
                locale="nl-NL"
                max={getMaxDateValue()}
                min={getMinDateValue()}
                onValueChange={handleValueChange}
                open={true}
                startOfWeek={1}
                timeZone="Europe/Amsterdam"
                value={getDateValue()}
              >
                <DatePickerView view="day">
                  <DatePickerContext>
                    {(api) => (
                      <>
                        <DatePickerViewControl>
                          <DatePickerPrevTrigger />
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                          <DatePickerNextTrigger />
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableHead>
                            <DatePickerTableRow>
                              <Show when={local.showWeekNumbers}>
                                <DatePickerTableHeader class="w-6 flex-none">
                                  Wk
                                </DatePickerTableHeader>
                              </Show>
                              <For each={api().weekDays}>
                                {(weekDay) => (
                                  <DatePickerTableHeader>
                                    {weekDay.short}
                                  </DatePickerTableHeader>
                                )}
                              </For>
                            </DatePickerTableRow>
                          </DatePickerTableHead>
                          <DatePickerTableBody>
                            <For each={api().weeks}>
                              {(week) => (
                                <DatePickerTableRow>
                                  <Show when={local.showWeekNumbers}>
                                    <td class="flex w-6 flex-none items-center justify-center font-normal text-[0.8rem] text-muted-foreground">
                                      {getWeek(
                                        week[0]?.toDate("Europe/Amsterdam") ??
                                          new Date()
                                      )}
                                    </td>
                                  </Show>
                                  <For each={week}>
                                    {(day) => (
                                      <DatePickerTableCell
                                        disabled={isDateDisabled(day)}
                                        value={day}
                                      >
                                        <DatePickerTableCellTrigger>
                                          {day.day}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </>
                    )}
                  </DatePickerContext>
                </DatePickerView>
                <DatePickerView view="month">
                  <DatePickerContext>
                    {(api) => (
                      <>
                        <DatePickerViewControl>
                          <DatePickerPrevTrigger />
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                          <DatePickerNextTrigger />
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableBody>
                            <For
                              each={api().getMonthsGrid({
                                columns: 4,
                                format: "short",
                              })}
                            >
                              {(months) => (
                                <DatePickerTableRow>
                                  <For each={months}>
                                    {(month) => (
                                      <DatePickerTableCell value={month.value}>
                                        <DatePickerTableCellTrigger>
                                          {month.label}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </>
                    )}
                  </DatePickerContext>
                </DatePickerView>
                <DatePickerView view="year">
                  <DatePickerContext>
                    {(api) => (
                      <>
                        <DatePickerViewControl>
                          <DatePickerPrevTrigger />
                          <DatePickerViewTrigger>
                            <DatePickerRangeText />
                          </DatePickerViewTrigger>
                          <DatePickerNextTrigger />
                        </DatePickerViewControl>
                        <DatePickerTable>
                          <DatePickerTableBody>
                            <For each={api().getYearsGrid({ columns: 4 })}>
                              {(years) => (
                                <DatePickerTableRow>
                                  <For each={years}>
                                    {(year) => (
                                      <DatePickerTableCell value={year.value}>
                                        <DatePickerTableCellTrigger>
                                          {year.label}
                                        </DatePickerTableCellTrigger>
                                      </DatePickerTableCell>
                                    )}
                                  </For>
                                </DatePickerTableRow>
                              )}
                            </For>
                          </DatePickerTableBody>
                        </DatePickerTable>
                      </>
                    )}
                  </DatePickerContext>
                </DatePickerView>
              </DatePicker>
            </PopoverContent>
          </Popover>
        </div>
        <Show when={local.clearButton}>
          <Button onClick={handleClear} size="icon" variant="ghost">
            <XIcon class="h-4 w-4" />
          </Button>
        </Show>
      </div>
      <Expandable expanded={!!props.error}>
        <div class={cn("mt-1 text-red-500 text-sm", local.errorClass)}>
          {props.error}
        </div>
      </Expandable>
    </div>
  );
};

export default ModularDatePicker;
