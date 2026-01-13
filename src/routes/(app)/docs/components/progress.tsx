import { ComponentPage } from "~/components/component-page";
import { Progress } from "~/components/ui/progress";

export default function ProgressPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Progress bar component for showing completion status."
      name="progress"
      registryName="progress"
      title="Progress"
    >
      <div class="w-full max-w-md space-y-4">
        <div>
          <p class="mb-1 text-sm">60% Complete</p>
          <Progress value={60} />
        </div>
        <div>
          <p class="mb-1 text-sm">25% Complete</p>
          <Progress value={25} />
        </div>
        <div>
          <p class="mb-1 text-sm">100% Complete</p>
          <Progress value={100} />
        </div>
      </div>
    </ComponentPage>
  );
}
