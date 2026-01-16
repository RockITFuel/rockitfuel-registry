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

type QuickLink = {
  title: string;
  sectionTitle: string; // matches sidebarNav category title
  href: string;
};

type Config = {
  mainNav: NavElement[];
  sidebarNav: NavCategory[];
  sectionQuickLinks: QuickLink[];
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
        { title: "Label", href: "/docs/components/label" },
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
        { title: "Textarea", href: "/docs/components/textarea" },
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
        { title: "Helpers", href: "/docs/blocks/helpers" },
      ],
    },
    {
      title: "Modular Form",
      items: [
        { title: "Overview", href: "/docs/modular-form", status: "new" },
        { title: "Input", href: "/docs/modular-form/input", status: "new" },
        {
          title: "Textarea",
          href: "/docs/modular-form/textarea",
          status: "new",
        },
        { title: "Select", href: "/docs/modular-form/select", status: "new" },
        {
          title: "Searchable Select",
          href: "/docs/modular-form/searchable-select",
          status: "new",
        },
        {
          title: "Combobox",
          href: "/docs/modular-form/combobox",
          status: "new",
        },
        {
          title: "Date Picker",
          href: "/docs/modular-form/date-picker",
          status: "new",
        },
        {
          title: "Checkbox",
          href: "/docs/modular-form/checkbox",
          status: "new",
        },
      ],
    },
    {
      title: "Charts",
      items: [
        { title: "Overview", href: "/docs/charts", status: "new" },
        { title: "Line Chart", href: "/docs/charts/line", status: "new" },
        { title: "Area Chart", href: "/docs/charts/area", status: "new" },
        { title: "Bar Chart", href: "/docs/charts/bar", status: "new" },
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
        {
          title: "useValidatedSearchParams",
          href: "/docs/hooks/use-validated-search-params",
          status: "new",
        },
      ],
    },
  ],
  sectionQuickLinks: [
    {
      title: "Getting Started",
      sectionTitle: "Getting Started",
      href: "/docs/getting-started",
    },
    {
      title: "Components",
      sectionTitle: "UI Components",
      href: "/docs/components",
    },
    { title: "Blocks", sectionTitle: "Blocks", href: "/docs/blocks" },
    {
      title: "Forms",
      sectionTitle: "Modular Form",
      href: "/docs/modular-form",
    },
    {
      title: "Charts",
      sectionTitle: "Charts",
      href: "/docs/charts",
    },
    { title: "Libraries", sectionTitle: "Libraries", href: "/docs/libraries" },
    { title: "Hooks", sectionTitle: "Hooks", href: "/docs/hooks" },
  ],
};

// Registry base URL for install commands
export const REGISTRY_URL =
  "https://solid-registry.coolify.wearearchitechs.dev";
