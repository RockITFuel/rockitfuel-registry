import { ComponentPage } from "~/components/component-page";

export default function DialogPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Modal dialog component for displaying content in an overlay."
      name="dialog"
      registryName="dialog"
      title="Dialog"
    />
  );
}
