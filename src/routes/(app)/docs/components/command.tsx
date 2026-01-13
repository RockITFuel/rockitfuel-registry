import { ComponentPage } from "~/components/component-page";

export default function CommandPage() {
  return (
    <ComponentPage
      dependencies={["cmdk-solid"]}
      description="Command palette/menu (cmdk-style) for keyboard-driven interfaces."
      name="command"
      registryName="command"
      title="Command"
    />
  );
}
