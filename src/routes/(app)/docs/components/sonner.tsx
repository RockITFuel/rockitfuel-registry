import { ComponentPage } from "~/components/component-page";

export default function SonnerPage() {
  return (
    <ComponentPage
      dependencies={["solid-sonner"]}
      description="Toast notifications using the sonner library."
      name="sonner"
      registryName="sonner"
      title="Sonner"
    />
  );
}
