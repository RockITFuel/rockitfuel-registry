import { ComponentPage } from "~/components/component-page";

export default function BreadcrumbPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="Navigation breadcrumb trail for showing the current location in a hierarchy."
      name="breadcrumb"
      registryName="breadcrumb"
      title="Breadcrumb"
    />
  );
}
