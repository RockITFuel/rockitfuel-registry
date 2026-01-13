import { ComponentPage } from "~/components/component-page";

export default function ColorPickerPage() {
  return (
    <ComponentPage
      dependencies={["@ark-ui/solid"]}
      description="Full-featured color picker with swatches and channel sliders."
      name="color-picker"
      registryName="color-picker"
      title="Color Picker"
    />
  );
}
