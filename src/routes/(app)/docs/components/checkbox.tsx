import { ComponentPage } from "~/components/component-page";
import { Checkbox } from "~/components/ui/checkbox";

export default function CheckboxPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Checkbox input component for boolean selections."
      name="checkbox"
      registryName="checkbox"
      title="Checkbox"
    >
      <div class="flex flex-col gap-4">
        <Checkbox>Accept terms and conditions</Checkbox>
        <Checkbox defaultChecked>Selected by default</Checkbox>
        <Checkbox disabled>Disabled checkbox</Checkbox>
      </div>
    </ComponentPage>
  );
}
