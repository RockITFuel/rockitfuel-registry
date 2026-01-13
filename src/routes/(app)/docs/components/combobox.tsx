import { ComponentPage } from "~/components/component-page";

export default function ComboboxPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Searchable dropdown with autocomplete functionality."
      name="combobox"
      registryName="combobox"
      title="Combobox"
    />
  );
}
