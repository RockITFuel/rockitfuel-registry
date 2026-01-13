import { CopyButton } from "~/components/copy-button";
import { REGISTRY_URL } from "~/config/docs";

type InstallCommandProps = {
  component: string;
};

export function InstallCommand(props: InstallCommandProps) {
  const command = () =>
    `npx shadcn@latest add ${REGISTRY_URL}/r/${props.component}.json`;

  return (
    <div class="relative rounded-md bg-muted">
      <pre class="overflow-x-auto p-4 pr-12 text-sm">
        <code>{command()}</code>
      </pre>
      <CopyButton class="absolute top-2 right-2" value={command()} />
    </div>
  );
}
