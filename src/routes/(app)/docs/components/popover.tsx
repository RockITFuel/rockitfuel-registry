import { ComponentPage } from "~/components/component-page";

export default function PopoverPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Popover component for displaying floating content."
      name="popover"
      registryName="popover"
      title="Popover"
    />
  );
}
