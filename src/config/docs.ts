type NavElement = {
  title: string;
  href: string;
  external?: boolean;
  status?: "new" | "updated";
};

type NavCategory = {
  title: string;
  items: NavElement[];
};

type Config = {
  mainNav: NavElement[];
  sidebarNav: NavCategory[];
};

export const docsConfig: Config = {
  mainNav: [
    {
      title: "Docs",
      href: "/docs/getting-started",
    },
    {
      title: "Components",
      href: "/docs/components",
    },
    {
      title: "Blocks",
      href: "/docs/blocks",
    },
    {
      title: "Libraries",
      href: "/docs/libraries",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/getting-started",
        },
      ],
    },
    {
      title: "UI Components",
      items: [
        { title: "Alert", href: "/docs/components/alert" },
        { title: "Avatar", href: "/docs/components/avatar" },
        { title: "Badge", href: "/docs/components/badge" },
        { title: "Breadcrumb", href: "/docs/components/breadcrumb" },
        { title: "Button", href: "/docs/components/button" },
        { title: "Card", href: "/docs/components/card" },
        { title: "Carousel", href: "/docs/components/carousel" },
        { title: "Checkbox", href: "/docs/components/checkbox" },
        { title: "Collapsible", href: "/docs/components/collapsible" },
        { title: "Color Picker", href: "/docs/components/color-picker" },
        { title: "Combobox", href: "/docs/components/combobox" },
        { title: "Command", href: "/docs/components/command" },
        { title: "Context Menu", href: "/docs/components/context-menu" },
        { title: "Date Picker", href: "/docs/components/date-picker" },
        { title: "Dialog", href: "/docs/components/dialog" },
        { title: "Dropdown Menu", href: "/docs/components/dropdown-menu" },
        { title: "Hover Card", href: "/docs/components/hover-card" },
        { title: "Input", href: "/docs/components/input" },
        { title: "Popover", href: "/docs/components/popover" },
        { title: "Progress", href: "/docs/components/progress" },
        { title: "Select", href: "/docs/components/select" },
        { title: "Separator", href: "/docs/components/separator" },
        { title: "Sheet", href: "/docs/components/sheet" },
        { title: "Skeleton", href: "/docs/components/skeleton" },
        { title: "Sonner", href: "/docs/components/sonner" },
        { title: "Switch", href: "/docs/components/switch" },
        { title: "Table", href: "/docs/components/table" },
        { title: "Tabs", href: "/docs/components/tabs" },
        { title: "Tooltip", href: "/docs/components/tooltip" },
      ],
    },
    {
      title: "Blocks",
      items: [
        {
          title: "App Sidebar",
          href: "/docs/blocks/app-sidebar",
          status: "new",
        },
        { title: "Super Form", href: "/docs/blocks/super-form", status: "new" },
        { title: "Helpers", href: "/docs/blocks/helpers" },
      ],
    },
    {
      title: "Libraries",
      items: [
        {
          title: "Gatehouse",
          href: "/docs/libraries/gatehouse",
          status: "new",
        },
        { title: "Solid Convex", href: "/docs/libraries/solid-convex" },
        { title: "Date Utils", href: "/docs/libraries/date-utils" },
      ],
    },
    {
      title: "Hooks",
      items: [
        { title: "useBindSignal", href: "/docs/hooks/use-bind-signal" },
        { title: "useLoading", href: "/docs/hooks/use-loading" },
      ],
    },
  ],
};

// Registry base URL for install commands
export const REGISTRY_URL =
  "https://solid-registry.coolify.wearearchitechs.dev";
