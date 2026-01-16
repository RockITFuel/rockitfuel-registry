import { Title } from "@solidjs/meta";
import { createMemo, createSignal, For } from "solid-js";
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
  calculateDimensions,
  createBandScale,
  createLinearScale,
  defaultColorPalette,
  formatNumber,
  getColorFromPalette,
  useChartTooltip,
  useResizeObserver,
} from "~/lib/charts";

// Demo data for the live example
const demoData = [
  { category: "Jan", value: 65 },
  { category: "Feb", value: 59 },
  { category: "Mar", value: 80 },
  { category: "Apr", value: 81 },
  { category: "May", value: 56 },
  { category: "Jun", value: 95 },
  { category: "Jul", value: 72 },
];

// Live bar chart demo component
function BarChartDemo() {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const tooltip = useChartTooltip<{ category: string; value: number }>();
  const size = useResizeObserver(containerRef, { debounceMs: 100 });

  const dimensions = createMemo(() =>
    calculateDimensions(size().width || 400, 300, {
      top: 20,
      right: 20,
      bottom: 40,
      left: 50,
    })
  );

  const xScale = createMemo(() =>
    createBandScale(
      demoData.map((d) => d.category),
      [0, dimensions().innerWidth],
      { padding: 0.2 }
    )
  );

  const yScale = createMemo(() =>
    createLinearScale([0, 100], [dimensions().innerHeight, 0], { nice: true })
  );

  return (
    <div class="relative w-full" ref={setContainerRef}>
      <svg
        aria-label="Bar chart showing monthly values"
        class="w-full"
        height={dimensions().height}
        role="img"
        viewBox={`0 0 ${dimensions().width} ${dimensions().height}`}
      >
        <title>Monthly values bar chart</title>
        <g
          transform={`translate(${dimensions().margin.left}, ${dimensions().margin.top})`}
        >
          {/* Grid lines */}
          <For each={yScale().ticks(5)}>
            {(tick) => (
              <line
                stroke="hsl(var(--border))"
                stroke-dasharray="4,4"
                stroke-opacity={0.5}
                x1={0}
                x2={dimensions().innerWidth}
                y1={yScale()(tick)}
                y2={yScale()(tick)}
              />
            )}
          </For>

          {/* Bars */}
          <For each={demoData}>
            {(d, i) => (
              <rect
                aria-label={`${d.category}: ${d.value}`}
                class="transition-opacity hover:opacity-80"
                fill={getColorFromPalette(i(), defaultColorPalette)}
                height={dimensions().innerHeight - yScale()(d.value)}
                onPointerEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const containerRect = containerRef()?.getBoundingClientRect();
                  if (containerRect) {
                    tooltip.show(d, {
                      x: rect.left - containerRect.left + rect.width / 2,
                      y: rect.top - containerRect.top - 10,
                    });
                  }
                }}
                onPointerLeave={() => tooltip.hide()}
                rx={4}
                width={xScale().bandwidth()}
                x={xScale()(d.category)}
                y={yScale()(d.value)}
              />
            )}
          </For>

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions().innerHeight})`}>
            <line
              stroke="hsl(var(--border))"
              x1={0}
              x2={dimensions().innerWidth}
            />
            <For each={demoData}>
              {(d) => (
                <text
                  fill="hsl(var(--muted-foreground))"
                  font-size="12"
                  text-anchor="middle"
                  x={(xScale()(d.category) ?? 0) + xScale().bandwidth() / 2}
                  y={25}
                >
                  {d.category}
                </text>
              )}
            </For>
          </g>

          {/* Y-axis */}
          <g>
            <line stroke="hsl(var(--border))" y2={dimensions().innerHeight} />
            <For each={yScale().ticks(5)}>
              {(tick) => (
                <text
                  dominant-baseline="middle"
                  fill="hsl(var(--muted-foreground))"
                  font-size="12"
                  text-anchor="end"
                  x={-10}
                  y={yScale()(tick)}
                >
                  {formatNumber(tick)}
                </text>
              )}
            </For>
          </g>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.isVisible() && (
        <div
          class="pointer-events-none absolute z-10 rounded-md border bg-popover px-3 py-2 shadow-md"
          style={{
            left: `${tooltip.state().position.x}px`,
            top: `${tooltip.state().position.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div class="font-medium text-sm">
            {tooltip.state().data?.category}
          </div>
          <div class="text-muted-foreground text-xs">
            Value: {formatNumber(tooltip.state().data?.value ?? 0)}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility modules for documentation
const utilityModules = [
  {
    name: "Scales",
    file: "scales.ts",
    description: "D3 scale wrappers for linear, time, band, and color scales",
    exports: [
      "createLinearScale",
      "createTimeScale",
      "createBandScale",
      "createPointScale",
      "createColorScale",
      "calculateDimensions",
      "computeNumericExtent",
      "computeTimeExtent",
    ],
  },
  {
    name: "Axis",
    file: "axis.ts",
    description: "Axis generators and styling utilities",
    exports: [
      "createAxisGenerator",
      "renderAxis",
      "styleAxis",
      "createGridLines",
      "styleGridLines",
      "getTickFormat",
    ],
  },
  {
    name: "Theme",
    file: "theme.ts",
    description: "Theme-aware color palettes and styling",
    exports: [
      "getChartTheme",
      "defaultColorPalette",
      "extendedColorPalette",
      "categoricalPalette",
      "sequentialPalette",
      "divergingPalette",
      "getColorFromPalette",
      "withOpacity",
      "chartStyles",
    ],
  },
  {
    name: "Tooltip",
    file: "tooltip.ts",
    description: "Reactive tooltip state and positioning",
    exports: [
      "useChartTooltip",
      "calculateTooltipPosition",
      "getRelativeMousePosition",
      "findClosestPoint",
      "findClosestPointByX",
      "bisectIndex",
    ],
  },
  {
    name: "Format",
    file: "format.ts",
    description: "Number, date, and label formatting utilities",
    exports: [
      "formatNumber",
      "formatCurrency",
      "formatPercent",
      "formatSI",
      "formatDate",
      "formatShortDate",
      "formatFullDate",
      "formatTime",
      "formatDateTime",
      "formatDuration",
      "formatBytes",
      "truncateLabel",
      "createAbbreviatedFormatter",
    ],
  },
  {
    name: "Resize",
    file: "resize.ts",
    description: "Responsive container sizing hooks",
    exports: [
      "useResizeObserver",
      "useChartDimensions",
      "getDevicePixelRatio",
      "scaleCanvas",
      "setSvgViewBox",
    ],
  },
];

const dependencies = ["d3"];

const usageExample = `import {
  calculateDimensions,
  createBandScale,
  createLinearScale,
  defaultColorPalette,
  formatNumber,
  getColorFromPalette,
  useChartTooltip,
  useResizeObserver,
} from "~/lib/charts";

const data = [
  { category: "Jan", value: 65 },
  { category: "Feb", value: 59 },
  { category: "Mar", value: 80 },
];

function MyChart() {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const size = useResizeObserver(containerRef);

  const dimensions = createMemo(() =>
    calculateDimensions(size().width, 300, {
      top: 20, right: 20, bottom: 40, left: 50,
    })
  );

  const xScale = createMemo(() =>
    createBandScale(
      data.map((d) => d.category),
      [0, dimensions().innerWidth],
      { padding: 0.2 }
    )
  );

  const yScale = createMemo(() =>
    createLinearScale([0, 100], [dimensions().innerHeight, 0], { nice: true })
  );

  return (
    <div ref={setContainerRef}>
      <svg viewBox={\`0 0 \${dimensions().width} \${dimensions().height}\`}>
        {/* Your chart elements here */}
      </svg>
    </div>
  );
}`;

export default function ChartsPage() {
  return (
    <>
      <Title>Charts - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Charts</PageHeaderHeading>
        <PageHeaderDescription>
          A collection of D3-based chart utilities for building custom,
          theme-aware charts in SolidJS. Includes scales, axes, formatting,
          tooltips, and responsive sizing helpers.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <H2 class="mb-4 font-semibold text-xl">Live Example</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            A responsive bar chart built using the chart utilities. Hover over
            bars to see tooltips.
          </p>
          <div class="rounded-md border bg-muted/50 p-4">
            <BarChartDemo />
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Installation</H2>
          <InstallCommand component="charts" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Dependencies</H2>
          <DependencyChips dependencies={dependencies} />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Included Utilities</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            The charts library includes 6 utility modules with{" "}
            {utilityModules.reduce((acc, m) => acc + m.exports.length, 0)}{" "}
            exported functions.
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <For each={utilityModules}>
              {(module) => (
                <div class="rounded-md border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <h3 class="font-medium">{module.name}</h3>
                    <code class="text-muted-foreground text-xs">
                      {module.file}
                    </code>
                  </div>
                  <p class="mb-3 text-muted-foreground text-sm">
                    {module.description}
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <For each={module.exports}>
                      {(fn) => (
                        <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {fn}
                        </code>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Usage</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Import utilities from the charts library to build custom charts:
          </p>
          <CodeBlock code={usageExample} lang="tsx" />
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Features</H2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong>Theme-aware colors:</strong> Palettes use CSS variables
              for automatic dark/light mode support
            </li>
            <li>
              <strong>Responsive sizing:</strong> useResizeObserver and
              useChartDimensions hooks for responsive charts
            </li>
            <li>
              <strong>D3 integration:</strong> Thin wrappers around D3 scales
              and axis generators
            </li>
            <li>
              <strong>SolidJS reactive:</strong> Hooks return signals for
              seamless reactivity
            </li>
            <li>
              <strong>Accessible formatting:</strong> Colorblind-friendly
              categorical palette included
            </li>
            <li>
              <strong>Tooltip helpers:</strong> Position calculation and closest
              point detection
            </li>
          </ul>
        </section>

        <section>
          <H2 class="mb-4 font-semibold text-xl">Color Palettes</H2>
          <p class="mb-4 text-muted-foreground text-sm">
            Available color palettes for different use cases:
          </p>
          <div class="space-y-4">
            <div>
              <h3 class="mb-2 font-medium text-sm">Default Palette</h3>
              <div class="flex gap-2">
                <For each={defaultColorPalette}>
                  {(color) => (
                    <div
                      class="h-8 w-8 rounded"
                      style={{ "background-color": color }}
                      title={color}
                    />
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
