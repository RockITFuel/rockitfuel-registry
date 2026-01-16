import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { For } from "solid-js";
import { CodeBlock } from "~/components/code-block";
import { DependencyChips } from "~/components/dependency-chips";
import { H2 } from "~/components/doc-heading";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import {
  ChartArea,
  ChartBar,
  type ChartConfig,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartRoot,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
} from "~/components/ui/chart";

// Demo data for line chart
const lineData = [
  { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
  { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
  { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
  { date: new Date("2024-04-01"), desktop: 73, mobile: 190 },
  { date: new Date("2024-05-01"), desktop: 209, mobile: 130 },
  { date: new Date("2024-06-01"), desktop: 214, mobile: 140 },
];

// Demo data for bar chart
const barData = [
  { category: "Jan", value: 186, profit: 80 },
  { category: "Feb", value: 305, profit: 200 },
  { category: "Mar", value: 237, profit: 120 },
  { category: "Apr", value: 73, profit: 190 },
  { category: "May", value: 209, profit: 130 },
  { category: "Jun", value: 214, profit: 140 },
];

const lineConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

const barConfig: ChartConfig = {
  value: { label: "Revenue", color: "hsl(var(--chart-1))" },
  profit: { label: "Profit", color: "hsl(var(--chart-2))" },
};

const areaConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

// Line chart demo
function LineChartDemo() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={lineConfig} data={lineData} height={300}>
        <ChartGrid horizontal />
        <ChartLine dataKey="desktop" dot />
        <ChartLine dataKey="mobile" dot />
        <ChartXAxis tickFormat="date" />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartLegend position="bottom" />
      </ChartRoot>
    </div>
  );
}

// Area chart demo
function AreaChartDemo() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={areaConfig} data={lineData} height={300}>
        <ChartGrid horizontal />
        <ChartArea dataKey="desktop" fillOpacity={0.3} gradient />
        <ChartArea dataKey="mobile" fillOpacity={0.3} gradient />
        <ChartXAxis tickFormat="date" />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartLegend position="bottom" />
      </ChartRoot>
    </div>
  );
}

// Bar chart demo
function BarChartDemo() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={barConfig} data={barData} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar activeBar dataKey="value" />
        <ChartXAxis />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <ChartLegend position="bottom" />
      </ChartRoot>
    </div>
  );
}

const chartTypes = [
  {
    title: "Line Chart",
    description: "Display trends over time with connected data points",
    href: "/docs/charts/line",
  },
  {
    title: "Area Chart",
    description: "Emphasize volume with filled areas under lines",
    href: "/docs/charts/area",
  },
  {
    title: "Bar Chart",
    description: "Compare categorical data with rectangular bars",
    href: "/docs/charts/bar",
  },
];

const dependencies = ["d3-array", "d3-scale", "d3-shape"];

const usageExample = `import {
  ChartRoot,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
} from "~/components/ui/chart";

const data = [
  { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
  { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
  { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
];

const config: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

function MyChart() {
  return (
    <ChartRoot data={data} config={config} height={400}>
      <ChartGrid horizontal />
      <ChartLine dataKey="desktop" dot />
      <ChartLine dataKey="mobile" dot />
      <ChartXAxis tickFormat="date" />
      <ChartYAxis tickFormat="number" />
      <ChartTooltip>
        <ChartTooltipContent />
      </ChartTooltip>
      <ChartLegend position="bottom" />
    </ChartRoot>
  );
}`;

export default function ChartsPage() {
  return (
    <>
      <Title>Charts - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Charts</PageHeaderHeading>
        <PageHeaderDescription>
          A composable chart library for SolidJS using declarative SVG rendering
          with D3 for mathematical computations. Follows shadcn/ui patterns for
          easy customization and theming.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <H2 class="mb-4 font-semibold text-xl">Installation</H2>
          <InstallCommand component="chart" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Dependencies</H2>
          <DependencyChips dependencies={dependencies} />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Line Chart</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Display trends over time with connected data points. Supports
            multiple series, dots, and various curve types.
          </p>
          <div class="rounded-md border bg-muted/50 p-4">
            <LineChartDemo />
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Area Chart</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Emphasize volume with filled areas under lines. Supports gradients,
            stacking, and transparency.
          </p>
          <div class="rounded-md border bg-muted/50 p-4">
            <AreaChartDemo />
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Bar Chart</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Compare categorical data with rectangular bars. Supports grouping,
            stacking, and hover effects.
          </p>
          <div class="rounded-md border bg-muted/50 p-4">
            <BarChartDemo />
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Usage</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Import chart components and compose them declaratively:
          </p>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Chart Types</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Detailed documentation for each chart type:
          </p>
          <div class="grid gap-4 md:grid-cols-3">
            <For each={chartTypes}>
              {(type) => (
                <A
                  class="rounded-md border p-4 transition-colors hover:bg-muted/50"
                  href={type.href}
                >
                  <h3 class="font-medium">{type.title}</h3>
                  <p class="mt-1 text-muted-foreground text-sm">
                    {type.description}
                  </p>
                </A>
              )}
            </For>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Features</H2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong>Composable:</strong> Build charts by combining small,
              focused components
            </li>
            <li>
              <strong>Declarative:</strong> SVG rendered directly in JSX, D3
              only for math
            </li>
            <li>
              <strong>Theme-aware:</strong> Uses CSS variables for automatic
              dark/light mode
            </li>
            <li>
              <strong>Responsive:</strong> ResizeObserver-based container sizing
            </li>
            <li>
              <strong>Interactive:</strong> Tooltips, legends, and hover effects
              built-in
            </li>
            <li>
              <strong>Animated:</strong> Smooth entrance and transition
              animations
            </li>
            <li>
              <strong>Accessible:</strong> ARIA labels and keyboard navigation
              support
            </li>
            <li>
              <strong>Exportable:</strong> PNG, SVG, and CSV export utilities
            </li>
          </ul>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Components</H2>
          <div class="grid gap-2 md:grid-cols-2">
            <div class="rounded-md border p-3">
              <h3 class="font-medium">Core</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartRoot
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartContext
                </code>
              </div>
            </div>
            <div class="rounded-md border p-3">
              <h3 class="font-medium">Layout</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartGrid
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartXAxis
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartYAxis
                </code>
              </div>
            </div>
            <div class="rounded-md border p-3">
              <h3 class="font-medium">Series</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartLine
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartArea
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartBar
                </code>
              </div>
            </div>
            <div class="rounded-md border p-3">
              <h3 class="font-medium">Interactive</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartTooltip
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartLegend
                </code>
              </div>
            </div>
            <div class="rounded-md border p-3">
              <h3 class="font-medium">Annotation</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartLabel
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartReferenceLine
                </code>
              </div>
            </div>
            <div class="rounded-md border p-3">
              <h3 class="font-medium">State</h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartEmpty
                </code>
                <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                  ChartLoading
                </code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
