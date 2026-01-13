import { ComponentPage } from "~/components/component-page";

export default function SheetPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core", "class-variance-authority"]}
      description="Slide-out panel/drawer component from the edges of the screen."
      name="sheet"
      registryName="sheet"
      title="Sheet"
    />
  );
}
