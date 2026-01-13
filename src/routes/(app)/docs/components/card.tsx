import { ComponentPage } from "~/components/component-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function CardPage() {
  return (
    <ComponentPage
      dependencies={[]}
      description="Card container component for displaying content in a box with optional header and footer."
      name="card"
      registryName="card"
      title="Card"
    >
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </ComponentPage>
  );
}
