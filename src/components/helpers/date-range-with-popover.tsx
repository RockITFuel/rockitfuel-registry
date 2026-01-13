import {
  type DateValue,
  useDatePickerContext,
} from "@ark-ui/solid/date-picker";
import { CalendarDate } from "@internationalized/date";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subYears,
} from "date-fns";
import { CalendarIcon } from "lucide-solid";
import { createEffect, createMemo, createSignal, Index, on } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  DatePicker,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
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

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface DayViewProps {
  monthOffset: number;
}

function DayView(props: DayViewProps) {
  const datePicker = useDatePickerContext();
  const offset = createMemo(() =>
    datePicker().getOffset({ months: props.monthOffset })
  );

  return (
    <DatePickerTable>
      <DatePickerTableHead>
        <DatePickerTableRow>
          <Index each={datePicker().weekDays}>
            {(weekDay) => (
              <DatePickerTableHeader>{weekDay().short}</DatePickerTableHeader>
            )}
          </Index>
        </DatePickerTableRow>
      </DatePickerTableHead>
      <DatePickerTableBody>
        <Index each={offset().weeks}>
          {(week) => (
            <DatePickerTableRow>
              <Index each={week()}>
                {(day) => (
                  <DatePickerTableCell
                    value={day()}
                    visibleRange={offset().visibleRange}
                  >
                    <DatePickerTableCellTrigger>
                      {day().day}
                    </DatePickerTableCellTrigger>
                  </DatePickerTableCell>
                )}
              </Index>
            </DatePickerTableRow>
          )}
        </Index>
      </DatePickerTableBody>
    </DatePickerTable>
  );
}

interface PopoverDateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export default function PopoverDateRangePicker(
  props: PopoverDateRangePickerProps
) {
  const [value, setValue] = createSignal<DateValue[] | undefined>();
  const [isOpen, setIsOpen] = createSignal(false);

  const today = new Date();
  const toCalendarDate = (date: Date) =>
    new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

  const presets = [
    {
      label: "Vandaag",
      value: [
        toCalendarDate(startOfDay(today)),
        toCalendarDate(endOfDay(today)),
      ],
    },
    {
      label: "Deze week",
      value: [
        toCalendarDate(startOfWeek(today)),
        toCalendarDate(endOfWeek(today)),
      ],
    },
    {
      label: "Laatste 7 dagen",
      value: [toCalendarDate(subDays(today, 7)), toCalendarDate(today)],
    },
    {
      label: "Deze maand",
      value: [
        toCalendarDate(startOfMonth(today)),
        toCalendarDate(endOfMonth(today)),
      ],
    },
    {
      label: "Laatste 30 dagen",
      value: [toCalendarDate(subDays(today, 30)), toCalendarDate(today)],
    },
    {
      label: "Dit jaar",
      value: [
        toCalendarDate(startOfYear(today)),
        toCalendarDate(endOfYear(today)),
      ],
    },
    {
      label: "Laatste 365 dagen",
      value: [toCalendarDate(subYears(today, 1)), toCalendarDate(today)],
    },
  ];

  createEffect(
    on(value, (value) => {
      if (value && value.length === 2) {
        props.onDateRangeChange({
          startDate: new Date(value[0].toString()),
          endDate: new Date(value[1].toString()),
        });
      }
    })
  );

  return (
    <div class="flex items-center gap-2">
      <DatePicker
        defaultValue={[
          new CalendarDate(
            props.dateRange.startDate.getFullYear(),
            props.dateRange.startDate.getMonth() + 1,
            props.dateRange.startDate.getDate()
          ),
          new CalendarDate(
            props.dateRange.endDate.getFullYear(),
            props.dateRange.endDate.getMonth() + 1,
            props.dateRange.endDate.getDate()
          ),
        ]}
        format={(e) => {
          try {
            const parsedDate = new Date(Date.parse(e.toString()));

            const normalizedDate = new Date(
              parsedDate.getUTCFullYear(),
              parsedDate.getUTCMonth(),
              parsedDate.getUTCDate()
            );

            return new Intl.DateTimeFormat("nl-NL", {
              dateStyle: "long",
            }).format(normalizedDate);
          } catch (error) {
            console.error(error);
            return "";
          }
        }}
        numOfMonths={2}
        onValueChange={(e) => {
          setValue(e.value);
        }}
        selectionMode="range"
        value={value()}
      >
        <DatePickerControl class="flex items-center gap-2">
          <DatePickerInput
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            index={0}
          />
          <span class="text-muted-foreground">tot</span>
          <DatePickerInput
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            index={1}
          />
        </DatePickerControl>
      </DatePicker>

      <Popover onOpenChange={setIsOpen} open={isOpen()} placement="bottom-end">
        <PopoverTrigger as={Button<"button">} size="sm" variant="outline">
          <CalendarIcon class="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent class="w-auto p-4">
          <DatePicker
            closeOnSelect={false}
            numOfMonths={2}
            onValueChange={(e) => {
              setValue(e.value);
              if (e.value && e.value.length === 2) {
                setIsOpen(false);
              }
            }}
            open={true}
            selectionMode="range"
            value={value()}
          >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr,auto]">
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
                      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <DayView monthOffset={0} />
                        <DayView monthOffset={1} />
                      </div>
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
                          <Index
                            each={api().getMonthsGrid({
                              columns: 4,
                              format: "short",
                            })}
                          >
                            {(months) => (
                              <DatePickerTableRow>
                                <Index each={months()}>
                                  {(month) => (
                                    <DatePickerTableCell value={month().value}>
                                      <DatePickerTableCellTrigger>
                                        {month().label}
                                      </DatePickerTableCellTrigger>
                                    </DatePickerTableCell>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            )}
                          </Index>
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
                          <Index
                            each={api().getYearsGrid({
                              columns: 4,
                            })}
                          >
                            {(years) => (
                              <DatePickerTableRow>
                                <Index each={years()}>
                                  {(year) => (
                                    <DatePickerTableCell value={year().value}>
                                      <DatePickerTableCellTrigger>
                                        {year().label}
                                      </DatePickerTableCellTrigger>
                                    </DatePickerTableCell>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            )}
                          </Index>
                        </DatePickerTableBody>
                      </DatePickerTable>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerView>
            </div>
          </DatePicker>
        </PopoverContent>
      </Popover>
    </div>
  );
}
