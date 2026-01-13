import { ComponentPage } from "~/components/component-page";
import { Input } from "~/components/ui/input";

export default function InputPage() {
  return (
    <ComponentPage
      dependencies={[]}
      description="Text input component for user input."
      name="input"
      registryName="input"
      title="Input"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <Input placeholder="Enter text..." type="text" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Input disabled placeholder="Disabled" />
      </div>
    </ComponentPage>
  );
}
