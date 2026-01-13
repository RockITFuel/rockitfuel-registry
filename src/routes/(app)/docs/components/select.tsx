import { ComponentPage } from "~/components/component-page";

export default function SelectPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Select dropdown component for choosing from options."
      name="select"
      registryName="select"
      title="Select"
    />
  );
}
