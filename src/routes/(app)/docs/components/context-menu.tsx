import { ComponentPage } from "~/components/component-page";

export default function ContextMenuPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Right-click context menu for showing contextual actions."
      name="context-menu"
      registryName="context-menu"
      title="Context Menu"
    />
  );
}
