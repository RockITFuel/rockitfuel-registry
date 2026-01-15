import { type ParentProps, Suspense } from "solid-js";

import Navbar from "~/components/navbar";
import { Toaster } from "~/components/ui/sonner";

export default function AppLayout(props: ParentProps) {
  return (
    <div class="border-border/40 dark:border-border" data-wrapper="">
      <Navbar />
      <div class="w-full">
        <div class="flex-1">
          <Suspense>{props.children}</Suspense>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
