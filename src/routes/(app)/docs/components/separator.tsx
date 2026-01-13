import { ComponentPage } from "~/components/component-page";
import { Separator } from "~/components/ui/separator";

export default function SeparatorPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Visual separator/divider for separating content."
      name="separator"
      registryName="separator"
      title="Separator"
    >
      <div class="w-full max-w-md">
        <div class="space-y-1">
          <h4 class="font-medium text-sm leading-none">Title</h4>
          <p class="text-muted-foreground text-sm">Description here.</p>
        </div>
        <Separator class="my-4" />
        <div class="flex h-5 items-center space-x-4 text-sm">
          <div>Item 1</div>
          <Separator orientation="vertical" />
          <div>Item 2</div>
          <Separator orientation="vertical" />
          <div>Item 3</div>
        </div>
      </div>
    </ComponentPage>
  );
}
