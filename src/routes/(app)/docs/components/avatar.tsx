import { ComponentPage } from "~/components/component-page";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function AvatarPage() {
  return (
    <ComponentPage
      dependencies={["@kobalte/core"]}
      description="User avatar component with image and fallback support."
      name="avatar"
      registryName="avatar"
      title="Avatar"
    >
      <div class="flex gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </ComponentPage>
  );
}
