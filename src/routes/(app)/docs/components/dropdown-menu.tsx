import { ComponentPage } from "~/components/component-page";

export default function DropdownMenuPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Dropdown menu with submenus, radio groups, and checkboxes."
      name="dropdown-menu"
      registryName="dropdown-menu"
      title="Dropdown Menu"
    />
  );
}
