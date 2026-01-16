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
import { Card, CardContent } from "~/components/ui/card";
import {
  ChartBar,
  type ChartConfig,
  ChartGrid,
  ChartLegend,
  ChartRoot,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
} from "~/components/ui/chart";

// Demo data
const data = [
  { category: "Jan", revenue: 186, profit: 80 },
  { category: "Feb", revenue: 305, profit: 200 },
  { category: "Mar", revenue: 237, profit: 120 },
  { category: "Apr", revenue: 173, profit: 90 },
  { category: "May", revenue: 209, profit: 130 },
  { category: "Jun", revenue: 214, profit: 140 },
];

const config: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  profit: { label: "Profit", color: "hsl(var(--chart-2))" },
};

// Basic example
function BasicBarChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar dataKey="revenue" />
        <ChartXAxis />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartRoot>
    </div>
  );
}

// With hover effect
function HoverBarChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar activeBar dataKey="revenue" />
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

// Custom radius
function RoundedBarChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar dataKey="revenue" radius={8} />
        <ChartXAxis />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartRoot>
    </div>
  );
}

// Custom size
function CustomSizeBarChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar dataKey="revenue" maxBarSize={30} />
        <ChartXAxis />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartRoot>
    </div>
  );
}

// Custom colors
function CustomColorBarChart() {
  const colorConfig: ChartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-3))" },
  };

  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={colorConfig} data={data} height={300} xKey="category">
        <ChartGrid horizontal />
        <ChartBar activeBar dataKey="revenue" radius={[6, 6, 0, 0]} />
        <ChartXAxis />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartRoot>
    </div>
  );
}

const dependencies = ["d3-array", "d3-scale", "d3-shape"];

const basicUsage = `import {
  ChartRoot,
  ChartBar,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const data = [
  { category: "Jan", value: 186 },
  { category: "Feb", value: 305 },
  { category: "Mar", value: 237 },
];

const config: ChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
};

function MyBarChart() {
  return (
    <ChartRoot data={data} config={config} height={300} xKey="category">
      <ChartGrid horizontal />
      <ChartBar dataKey="value" />
      <ChartXAxis />
      <ChartYAxis tickFormat="number" />
      <ChartTooltip>
        <ChartTooltipContent />
      </ChartTooltip>
    </ChartRoot>
  );
}`;

const radiusUsage = `// Single radius for all corners
<ChartBar dataKey="value" radius={8} />

// Individual corner radii [topLeft, topRight, bottomRight, bottomLeft]
<ChartBar dataKey="value" radius={[6, 6, 0, 0]} />`;

const sizeUsage = `// Maximum bar width
<ChartBar dataKey="value" maxBarSize={30} />

// Minimum bar width
<ChartBar dataKey="value" minBarSize={10} />

// Fixed bar width
<ChartBar dataKey="value" barSize={40} />`;

const hoverUsage = `// Enable hover highlighting
<ChartBar dataKey="value" activeBar />`;

const props = [
  {
    name: "dataKey",
    type: "string",
    default: "required",
    description: "Key in data for Y values",
  },
  {
    name: "xKey",
    type: "string",
    default: '"category"',
    description: "Key in data for X values",
  },
  {
    name: "fill",
    type: "string",
    default: "from config",
    description: "Bar fill color",
  },
  {
    name: "radius",
    type: "number | [n,n,n,n]",
    default: "[4,4,0,0]",
    description: "Border radius",
  },
  {
    name: "stack",
    type: '"none" | "stacked" | "expanded"',
    default: '"none"',
    description: "Stacking mode",
  },
  {
    name: "stackId",
    type: "string",
    default: "-",
    description: "Group ID for stacking",
  },
  {
    name: "layout",
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: "Bar orientation",
  },
  {
    name: "barSize",
    type: "number",
    default: "auto",
    description: "Fixed bar width",
  },
  {
    name: "maxBarSize",
    type: "number",
    default: "50",
    description: "Maximum bar width",
  },
  {
    name: "minBarSize",
    type: "number",
    default: "2",
    description: "Minimum bar width",
  },
  {
    name: "animate",
    type: "boolean",
    default: "true",
    description: "Enable animations",
  },
  {
    name: "activeBar",
    type: "boolean",
    default: "false",
    description: "Highlight on hover",
  },
];

export default function BarChartPage() {
  return (
    <>
      <Title>Bar Chart - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Bar Chart</PageHeaderHeading>
        <PageHeaderDescription>
          Compare categorical data with rectangular bars. Supports grouping,
          stacking, and hover effects.
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
          <H2 class="mb-4 font-semibold text-xl">Basic Usage</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            A simple bar chart with categorical data.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <BasicBarChart />
            </CardContent>
          </Card>
          <CodeBlock code={basicUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Hover Effect</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Highlight bars on hover with the activeBar prop.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <HoverBarChart />
            </CardContent>
          </Card>
          <CodeBlock code={hoverUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Rounded Corners</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Customize the corner radius of bars.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <RoundedBarChart />
            </CardContent>
          </Card>
          <CodeBlock code={radiusUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Bar Size</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Control the width of bars.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <CustomSizeBarChart />
            </CardContent>
          </Card>
          <CodeBlock code={sizeUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Custom Styling</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Customize colors and other visual properties.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <CustomColorBarChart />
            </CardContent>
          </Card>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Props</H2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-2 pr-4 text-left font-medium">Prop</th>
                  <th class="py-2 pr-4 text-left font-medium">Type</th>
                  <th class="py-2 pr-4 text-left font-medium">Default</th>
                  <th class="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <For each={props}>
                  {(prop) => (
                    <tr class="border-b">
                      <td class="py-2 pr-4">
                        <code class="rounded bg-muted px-1 py-0.5 text-xs">
                          {prop.name}
                        </code>
                      </td>
                      <td class="py-2 pr-4">
                        <code class="text-muted-foreground text-xs">
                          {prop.type}
                        </code>
                      </td>
                      <td class="py-2 pr-4">
                        <code class="text-xs">{prop.default}</code>
                      </td>
                      <td class="py-2 text-muted-foreground">
                        {prop.description}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Related</H2>
          <div class="flex gap-4">
            <A
              class="rounded-md border p-4 transition-colors hover:bg-muted/50"
              href="/docs/charts/line"
            >
              <h3 class="font-medium">Line Chart</h3>
              <p class="mt-1 text-muted-foreground text-sm">
                Connected data points
              </p>
            </A>
            <A
              class="rounded-md border p-4 transition-colors hover:bg-muted/50"
              href="/docs/charts/area"
            >
              <h3 class="font-medium">Area Chart</h3>
              <p class="mt-1 text-muted-foreground text-sm">
                Filled areas under lines
              </p>
            </A>
          </div>
        </section>
      </div>
    </>
  );
}
