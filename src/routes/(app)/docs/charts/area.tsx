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
  ChartArea,
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
  { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
  { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
  { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
  { date: new Date("2024-04-01"), desktop: 73, mobile: 190 },
  { date: new Date("2024-05-01"), desktop: 209, mobile: 130 },
  { date: new Date("2024-06-01"), desktop: 214, mobile: 140 },
];

const config: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
};

// Basic example
function BasicAreaChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartArea dataKey="desktop" fillOpacity={0.3} />
        <ChartXAxis tickFormat="date" />
        <ChartYAxis tickFormat="number" />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartRoot>
    </div>
  );
}

// Multiple series
function MultiSeriesAreaChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartArea dataKey="desktop" fillOpacity={0.3} />
        <ChartArea dataKey="mobile" fillOpacity={0.3} />
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

// With gradient
function GradientAreaChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartArea dataKey="desktop" gradient />
        <ChartArea dataKey="mobile" gradient />
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

// Linear curve
function LinearAreaChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartArea curve="linear" dataKey="desktop" fillOpacity={0.3} />
        <ChartArea curve="linear" dataKey="mobile" fillOpacity={0.3} />
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

// With dots
function AreaChartWithDots() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartArea dataKey="desktop" dot fillOpacity={0.3} />
        <ChartArea dataKey="mobile" dot fillOpacity={0.3} />
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

const dependencies = ["d3-array", "d3-scale", "d3-shape"];

const basicUsage = `import {
  ChartRoot,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
  ChartGrid,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const data = [
  { date: new Date("2024-01-01"), value: 186 },
  { date: new Date("2024-02-01"), value: 305 },
  { date: new Date("2024-03-01"), value: 237 },
];

const config: ChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
};

function MyAreaChart() {
  return (
    <ChartRoot data={data} config={config} height={300}>
      <ChartGrid horizontal />
      <ChartArea dataKey="value" fillOpacity={0.3} />
      <ChartXAxis tickFormat="date" />
      <ChartYAxis tickFormat="number" />
      <ChartTooltip>
        <ChartTooltipContent />
      </ChartTooltip>
    </ChartRoot>
  );
}`;

const gradientUsage = `// Gradient fill (vertical gradient from top to bottom)
<ChartArea dataKey="value" gradient />

// Custom fill opacity
<ChartArea dataKey="value" fillOpacity={0.5} />

// With stroke on top edge
<ChartArea dataKey="value" strokeWidth={2} />`;

const curveUsage = `// Natural curve (default, smooth)
<ChartArea dataKey="value" curve="natural" />

// Linear curve (straight lines)
<ChartArea dataKey="value" curve="linear" />

// Step curve (staircase)
<ChartArea dataKey="value" curve="step" />`;

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
    default: '"date"',
    description: "Key in data for X values",
  },
  {
    name: "stroke",
    type: "string",
    default: "from config",
    description: "Line stroke color",
  },
  {
    name: "strokeWidth",
    type: "number",
    default: "2",
    description: "Line stroke width",
  },
  {
    name: "fill",
    type: "string",
    default: "from config",
    description: "Area fill color",
  },
  {
    name: "fillOpacity",
    type: "number",
    default: "0.3",
    description: "Fill opacity",
  },
  {
    name: "curve",
    type: '"natural" | "linear" | "step"',
    default: '"natural"',
    description: "Interpolation type",
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
    name: "connectNulls",
    type: "boolean",
    default: "false",
    description: "Connect across null values",
  },
  {
    name: "animate",
    type: "boolean",
    default: "true",
    description: "Enable animations",
  },
  {
    name: "dot",
    type: "boolean",
    default: "false",
    description: "Show dots on data points",
  },
  {
    name: "gradient",
    type: "boolean",
    default: "false",
    description: "Use gradient fill",
  },
];

export default function AreaChartPage() {
  return (
    <>
      <Title>Area Chart - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Area Chart</PageHeaderHeading>
        <PageHeaderDescription>
          Emphasize volume with filled areas under lines. Supports gradients,
          stacking, and transparency.
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
            A simple area chart with a single series.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <BasicAreaChart />
            </CardContent>
          </Card>
          <CodeBlock code={basicUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Multiple Series</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Display multiple data series with overlapping areas.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <MultiSeriesAreaChart />
            </CardContent>
          </Card>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Gradient Fill</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Use a vertical gradient from opaque to transparent.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <GradientAreaChart />
            </CardContent>
          </Card>
          <CodeBlock code={gradientUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Curve Types</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Different interpolation methods for the area boundary.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <LinearAreaChart />
            </CardContent>
          </Card>
          <CodeBlock code={curveUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">With Dots</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Show data point dots along the area.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <AreaChartWithDots />
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
                Lines without fill
              </p>
            </A>
            <A
              class="rounded-md border p-4 transition-colors hover:bg-muted/50"
              href="/docs/charts/bar"
            >
              <h3 class="font-medium">Bar Chart</h3>
              <p class="mt-1 text-muted-foreground text-sm">
                Categorical bar data
              </p>
            </A>
          </div>
        </section>
      </div>
    </>
  );
}
