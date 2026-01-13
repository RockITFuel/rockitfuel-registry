import { ComponentPage } from "~/components/component-page";

export default function HoverCardPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Card that appears on hover for displaying additional information."
      name="hover-card"
      registryName="hover-card"
      title="Hover Card"
    />
  );
}
