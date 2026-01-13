import { ComponentPage } from "~/components/component-page";

export default function CollapsiblePage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Collapsible/accordion section for showing and hiding content."
      name="collapsible"
      registryName="collapsible"
      title="Collapsible"
    />
  );
}
