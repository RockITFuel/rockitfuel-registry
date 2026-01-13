import { ComponentPage } from "~/components/component-page";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/switch";

export default function SwitchPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Toggle switch component for boolean settings."
      name="switch"
      registryName="switch"
      title="Switch"
    >
      <Switch class="flex items-center space-x-2">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Airplane Mode</SwitchLabel>
      </Switch>
    </ComponentPage>
  );
}
