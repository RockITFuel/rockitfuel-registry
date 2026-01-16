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
function BasicLineChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartLine dataKey="desktop" />
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
function MultiSeriesLineChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartLine dataKey="desktop" />
        <ChartLine dataKey="mobile" />
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
function LineChartWithDots() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
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

// Linear curve
function LinearCurveChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartLine curve="linear" dataKey="desktop" dot />
        <ChartLine curve="linear" dataKey="mobile" dot />
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

// Step curve
function StepCurveChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartLine curve="step" dataKey="desktop" />
        <ChartLine curve="step" dataKey="mobile" />
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

// Custom styling
function CustomStyledChart() {
  return (
    <div class="h-[300px] w-full">
      <ChartRoot config={config} data={data} height={300}>
        <ChartGrid horizontal />
        <ChartLine
          dataKey="desktop"
          dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
          stroke="hsl(var(--chart-1))"
          strokeWidth={3}
        />
        <ChartLine dataKey="mobile" strokeDasharray="5,5" strokeWidth={2} />
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
  ChartLine,
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

function MyLineChart() {
  return (
    <ChartRoot data={data} config={config} height={300}>
      <ChartGrid horizontal />
      <ChartLine dataKey="value" />
      <ChartXAxis tickFormat="date" />
      <ChartYAxis tickFormat="number" />
      <ChartTooltip>
        <ChartTooltipContent />
      </ChartTooltip>
    </ChartRoot>
  );
}`;

const multiSeriesUsage = `// Multiple series with legend
<ChartRoot data={data} config={config} height={300}>
  <ChartGrid horizontal />
  <ChartLine dataKey="desktop" />
  <ChartLine dataKey="mobile" />
  <ChartXAxis tickFormat="date" />
  <ChartYAxis tickFormat="number" />
  <ChartTooltip>
    <ChartTooltipContent />
  </ChartTooltip>
  <ChartLegend position="bottom" />
</ChartRoot>`;

const dotsUsage = `// With data point dots
<ChartLine dataKey="value" dot />

// With custom dot props
<ChartLine
  dataKey="value"
  dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
/>`;

const curveUsage = `// Natural curve (default, smooth)
<ChartLine dataKey="value" curve="natural" />

// Linear curve (straight lines)
<ChartLine dataKey="value" curve="linear" />

// Step curve (staircase)
<ChartLine dataKey="value" curve="step" />`;

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
    name: "strokeDasharray",
    type: "string",
    default: "-",
    description: 'Dash pattern (e.g., "5,5")',
  },
  {
    name: "curve",
    type: '"natural" | "linear" | "step"',
    default: '"natural"',
    description: "Interpolation type",
  },
  {
    name: "connectNulls",
    type: "boolean",
    default: "false",
    description: "Connect across null values",
  },
  {
    name: "dot",
    type: "boolean | DotProps",
    default: "false",
    description: "Show dots on points",
  },
  {
    name: "activeDot",
    type: "boolean | DotProps",
    default: "true",
    description: "Show dot on hover",
  },
  {
    name: "animate",
    type: "boolean",
    default: "true",
    description: "Enable animations",
  },
  {
    name: "yAxisId",
    type: '"left" | "right"',
    default: '"left"',
    description: "Which Y axis to use",
  },
];

export default function LineChartPage() {
  return (
    <>
      <Title>Line Chart - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Line Chart</PageHeaderHeading>
        <PageHeaderDescription>
          Display trends over time with connected data points. Supports multiple
          series, various curve types, and configurable dots.
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
            A simple line chart with a single series.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <BasicLineChart />
            </CardContent>
          </Card>
          <CodeBlock code={basicUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Multiple Series</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Display multiple data series with a legend.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <MultiSeriesLineChart />
            </CardContent>
          </Card>
          <CodeBlock code={multiSeriesUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">With Dots</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Show data point dots along the line.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <LineChartWithDots />
            </CardContent>
          </Card>
          <CodeBlock code={dotsUsage} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Curve Types</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Different interpolation methods for the line.
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent class="p-4">
                <p class="mb-2 font-medium text-sm">Linear</p>
                <LinearCurveChart />
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-4">
                <p class="mb-2 font-medium text-sm">Step</p>
                <StepCurveChart />
              </CardContent>
            </Card>
          </div>
          <div class="mt-4">
            <CodeBlock code={curveUsage} lang="tsx" />
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Custom Styling</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Customize stroke width, dash patterns, and colors.
          </p>
          <Card class="mb-4">
            <CardContent class="p-4">
              <CustomStyledChart />
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
              href="/docs/charts/area"
            >
              <h3 class="font-medium">Area Chart</h3>
              <p class="mt-1 text-muted-foreground text-sm">
                Filled areas under lines
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
