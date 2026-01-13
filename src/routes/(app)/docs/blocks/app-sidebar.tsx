import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";

const components = [
  "sidebar-provider",
  "sidebar-container",
  "sidebar-content",
  "sidebar-header",
  "sidebar-footer",
  "sidebar-trigger",
  "sidebar-button",
  "sidebar-button-list",
  "sidebar-user",
  "sidebar-screen-content",
  "sidebar-screen-header",
  "side-bar-seperator",
];

export default function AppSidebarPage() {
  return (
    <>
      <Title>App Sidebar - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>App Sidebar</PageHeaderHeading>
        <PageHeaderDescription>
          A complete responsive sidebar navigation system with mobile support,
          keyboard shortcuts, and theme toggle. Includes 12 composable
          components.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="app-sidebar" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Dependencies</h2>
          <div class="flex flex-wrap gap-2">
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @solid-primitives/storage
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">
              @kobalte/core
            </code>
            <code class="rounded bg-muted px-2 py-1 text-sm">lucide-solid</code>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Included Components</h2>
          <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <For each={components}>
              {(component) => (
                <div class="rounded-md border px-3 py-2 text-sm">
                  <code>{component}</code>
                </div>
              )}
            </For>
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Responsive design with mobile sheet navigation</li>
            <li>Collapsible sidebar with keyboard shortcut (Cmd+B)</li>
            <li>Persistent state using local storage</li>
            <li>Screen-based content organization</li>
            <li>User menu with dropdown</li>
            <li>Customizable navigation items</li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Usage</h2>
          <div class="rounded-md bg-muted p-4">
            <pre class="overflow-x-auto text-sm">
              <code>{`import {
  SidebarProvider,
  SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarButtonList,
  SidebarScreenContent
} from "~/components/app-sidebar"

function App() {
  return (
    <SidebarProvider>
      <SidebarContainer>
        <SidebarHeader>
          <h1>My App</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarButtonList routes={routes} />
        </SidebarContent>
      </SidebarContainer>
      <SidebarScreenContent>
        {/* Your main content */}
      </SidebarScreenContent>
    </SidebarProvider>
  )
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </>
  );
}
