import { ComponentPage } from "~/components/component-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function AlertPage() {
  return (
    <ComponentPage
      dependencies={["class-variance-authority"]}
      description="Alert/notification component for displaying important messages."
      name="alert"
      registryName="alert"
      title="Alert"
    >
      <div class="flex w-full max-w-md flex-col gap-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the cli.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </div>
    </ComponentPage>
  );
}
