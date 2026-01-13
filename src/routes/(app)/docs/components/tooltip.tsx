import { ComponentPage } from "~/components/component-page";

export default function TooltipPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Tooltip component for displaying additional information on hover."
      name="tooltip"
      registryName="tooltip"
      title="Tooltip"
    />
  );
}
