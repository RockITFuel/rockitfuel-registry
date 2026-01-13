import { ComponentPage } from "~/components/component-page";
import { Badge } from "~/components/ui/badge";

export default function BadgePage() {
  return (
    <ComponentPage
      dependencies={["class-variance-authority"]}
      description="Badge/tag component for displaying labels and status."
      name="badge"
      registryName="badge"
      title="Badge"
    >
      <div class="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </ComponentPage>
  );
}
