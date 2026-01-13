import { ComponentPage } from "~/components/component-page";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function TextareaPage() {
  return (
    <ComponentPage
      dependencies={[]}
      description="Textarea component for multi-line text input."
      name="textarea"
      registryName="textarea"
      related={[
        {
          title: "Input",
          href: "/docs/components/input",
          description: "Single-line text input",
        },
        {
          title: "Label",
          href: "/docs/components/label",
          description: "Accessible label component",
        },
      ]}
      title="Textarea"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <Label for="message">Message</Label>
          <Textarea id="message" placeholder="Enter your message..." />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="disabled">Disabled</Label>
          <Textarea disabled id="disabled" placeholder="This is disabled" />
        </div>
      </div>
    </ComponentPage>
  );
}
