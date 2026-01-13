import { ComponentPage } from "~/components/component-page";

export default function DatePickerPage() {
  return (
    <ComponentPage
      dependencies={["@ark-ui/solid", "@internationalized/date"]}
      description="Date selection component with calendar UI."
      name="date-picker"
      registryName="date-picker"
      title="Date Picker"
    />
  );
}
