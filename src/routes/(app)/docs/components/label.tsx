import { ComponentPage } from "~/components/component-page";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function LabelPage() {
  return (
    <ComponentPage
      dependencies={[]}
      description="Accessible label component for form inputs."
      name="label"
      registryName="label"
      related={[
        {
          title: "Input",
          href: "/docs/components/input",
          description: "Text input component",
        },
        {
          title: "Checkbox",
          href: "/docs/components/checkbox",
          description: "Checkbox component",
        },
        {
          title: "Textarea",
          href: "/docs/components/textarea",
          description: "Textarea component",
        },
      ]}
      title="Label"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <Label for="email">Email</Label>
          <Input id="email" placeholder="Enter your email" type="email" />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="name">Name</Label>
          <Input id="name" placeholder="Enter your name" type="text" />
        </div>
      </div>
    </ComponentPage>
  );
}
