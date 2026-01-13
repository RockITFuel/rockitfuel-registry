import { ComponentPage } from "~/components/component-page";
import { Button } from "~/components/ui/button";

export default function ButtonPage() {
  return (
    <ComponentPage
      dependencies={[
        "@kobalte/core",
        "class-variance-authority",
        "lucide-solid",
      ]}
      description="Button component with variants, loading state, and button group support."
      name="button"
      registryName="button"
      title="Button"
    >
      <div class="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </ComponentPage>
  );
}
