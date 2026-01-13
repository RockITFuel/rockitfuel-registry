import type { ColorPickerValueChangeDetails } from "@ark-ui/solid/color-picker";
import { ColorPicker, parseColor } from "@ark-ui/solid/color-picker";
import type { Component, ComponentProps } from "solid-js";
import { createEffect, createSignal, For, Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";
import {
  ColorPickerAreaBackgroundComponent,
  ColorPickerAreaComponent,
  ColorPickerAreaThumbComponent,
  ColorPickerChannelSliderComponent,
  ColorPickerChannelSliderThumbComponent,
  ColorPickerChannelSliderTrackComponent,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerHiddenInput,
  ColorPickerInput,
  ColorPickerPositioner,
  ColorPickerSwatchComponent,
  ColorPickerSwatchGroup,
  ColorPickerSwatchIndicatorComponent,
  ColorPickerSwatchTriggerComponent,
  ColorPickerTransparencyGridComponent,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
  ColorPickerView,
} from "../ui/color-picker";
import { SuperError } from "./super-error";
import { SuperLabel } from "./super-label";

type SuperColorPickerProps = Omit<ComponentProps<"input">, "value"> & {
  value?: string;
  label?: string;
  error?: string;
  name: string;
  wrapperClass?: string;
  labelClass?: string;
  errorClass?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  showSwatches?: boolean;
  swatchColors?: string[];
  format?: "rgba" | "hsla" | "hsba";
  alphaDisabled?: boolean;
};

const SuperColorPicker: Component<SuperColorPickerProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "label",
    "error",
    "wrapperClass",
    "labelClass",
    "errorClass",
    "onValueChange",
    "showSwatches",
    "swatchColors",
    "format",
    "placeholder",
    "value",
    "name",
    "required",
    "alphaDisabled",
  ]);

  const [colorValue, setColorValue] = createSignal(
    local.value ? parseColor(local.value) : parseColor("#000000")
  );

  // Update color when value prop changes
  createEffect(() => {
    if (local.value) {
      setColorValue(parseColor(local.value));
    }
  });

  const defaultSwatchColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#ec4899",
    "#f43f5e",
  ];

  return (
    <div class={cn("w-full items-center space-y-1.5", local.wrapperClass)}>
      <SuperLabel
        class={local.labelClass}
        label={local.label}
        name={local.name}
        required={local.required}
      />
      <ColorPicker.Root
        defaultValue={colorValue()}
        format={local.format}
        onValueChange={(details: ColorPickerValueChangeDetails) => {
          setColorValue(details.value);
          const hexValue = details.value.toString("hex");
          local.onValueChange?.(hexValue);
        }}
        value={colorValue()}
      >
        <ColorPickerControl
          class={cn(
            "flex gap-2",
            local.error && "rounded-md p-2 ring-2 ring-red-500"
          )}
        >
          <ColorPickerInput
            channel="hex"
            class={cn(local.class, local.error && "!ring-red-500 ring-2")}
            placeholder={local.placeholder ?? "#000000"}
          />
          <ColorPickerTrigger
            aria-errormessage={`${local.name}-error`}
            aria-invalid={!!local.error}
          >
            <ColorPickerTransparencyGridComponent />
            <ColorPickerValueSwatch />
          </ColorPickerTrigger>
        </ColorPickerControl>

        <ColorPickerPositioner>
          <ColorPickerContent class="w-80">
            <div class="space-y-3">
              {/* Color Area */}
              <ColorPickerAreaComponent>
                <ColorPickerAreaBackgroundComponent />
                <ColorPickerAreaThumbComponent />
              </ColorPickerAreaComponent>

              {/* Hue Slider */}
              <ColorPickerChannelSliderComponent channel="hue">
                <ColorPickerChannelSliderTrackComponent />
                <ColorPickerChannelSliderThumbComponent />
              </ColorPickerChannelSliderComponent>

              {/* Alpha Slider */}
              <ColorPickerChannelSliderComponent channel="alpha">
                <ColorPickerTransparencyGridComponent />
                <ColorPickerChannelSliderTrackComponent />
                <ColorPickerChannelSliderThumbComponent />
              </ColorPickerChannelSliderComponent>

              {/* Swatches */}
              {local.showSwatches !== false && (
                <ColorPickerSwatchGroup class="flex flex-wrap gap-2">
                  <For each={local.swatchColors ?? defaultSwatchColors}>
                    {(color) => (
                      <ColorPickerSwatchTriggerComponent value={color}>
                        <ColorPickerSwatchComponent value={color}>
                          <ColorPickerSwatchIndicatorComponent>
                            ✓
                          </ColorPickerSwatchIndicatorComponent>
                        </ColorPickerSwatchComponent>
                      </ColorPickerSwatchTriggerComponent>
                    )}
                  </For>
                </ColorPickerSwatchGroup>
              )}

              {/* Channel Inputs */}
              <ColorPickerView class="space-y-2" format="rgba">
                <div class="grid grid-cols-4 gap-2">
                  <ColorPickerInput channel="red" class="text-xs" />
                  <ColorPickerInput channel="green" class="text-xs" />
                  <ColorPickerInput channel="blue" class="text-xs" />
                  <Show when={!local.alphaDisabled}>
                    <ColorPickerInput channel="alpha" class="text-xs" />
                  </Show>
                </div>
              </ColorPickerView>

              <ColorPickerView class="space-y-2" format="hsla">
                <div class="grid grid-cols-4 gap-2">
                  <ColorPickerInput channel="hue" class="text-xs" />
                  <ColorPickerInput channel="saturation" class="text-xs" />
                  <ColorPickerInput channel="lightness" class="text-xs" />
                  <Show when={!local.alphaDisabled}>
                    <ColorPickerInput channel="alpha" class="text-xs" />
                  </Show>
                </div>
              </ColorPickerView>
            </div>
          </ColorPickerContent>
        </ColorPickerPositioner>

        <ColorPickerHiddenInput {...others} name={local.name} />
      </ColorPicker.Root>

      <SuperError
        class={local.errorClass}
        error={local.error}
        name={local.name}
      />
    </div>
  );
};

export default SuperColorPicker;
