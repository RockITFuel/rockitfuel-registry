import {
  SidebarButtonList,
  SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "~/components/app-sidebar";

const testRoutes = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Settings", href: "/settings" },
  { title: "Profile", href: "/profile" },
];

const testRoutes2 = [
  { title: "Users", href: "/users" },
  { title: "Teams", href: "/teams" },
];

const testRoutes3 = [
  { title: "Reports", href: "/reports" },
  { title: "Analytics", href: "/analytics" },
];

export default function SidebarFixture() {
  return (
    <SidebarProvider>
      <SidebarContainer>
        <SidebarHeader>
          <h1 class="font-bold text-lg">Test Sidebar</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarButtonList
            id="section-1"
            routes={testRoutes}
            title="Section One"
          />
          <SidebarButtonList
            id="section-2"
            routes={testRoutes2}
            title="Section Two"
          />
          <SidebarButtonList
            id="section-3"
            routes={testRoutes3}
            title="Section Three"
          />
        </SidebarContent>
      </SidebarContainer>
      <main class="flex-1 p-8" data-testid="main-content">
        <h2>Main Content Area</h2>
        <p>This is a test fixture for the collapsible sidebar.</p>
      </main>
    </SidebarProvider>
  );
}
