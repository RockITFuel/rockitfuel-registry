import { ComponentPage } from "~/components/component-page";

export default function TabsPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Tabbed interface component for organizing content."
      name="tabs"
      registryName="tabs"
      title="Tabs"
    />
  );
}
