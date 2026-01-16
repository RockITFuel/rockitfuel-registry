/**
 * Chart Components
 *
 * A composable chart library for SolidJS using declarative SVG rendering
 * with D3 for mathematical computations. Follows shadcn/ui patterns.
 *
 * @example
 * ```tsx
 * import {
 *   ChartRoot,
 *   ChartLine,
 *   ChartXAxis,
 *   ChartYAxis,
 *   ChartGrid,
 *   ChartTooltip,
 *   ChartTooltipContent,
 *   type ChartConfig,
 * } from "@/components/ui/chart";
 *
 * const config: ChartConfig = {
 *   revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
 * };
 *
 * <ChartRoot data={data} config={config}>
 *   <ChartGrid horizontal />
 *   <ChartLine dataKey="revenue" />
 *   <ChartXAxis tickFormat="date" />
 *   <ChartYAxis tickFormat="currency" />
 *   <ChartTooltip>
 *     <ChartTooltipContent />
 *   </ChartTooltip>
 * </ChartRoot>
 * ```
 */

export type { ChartAreaProps } from "./chart-area";
export { ChartArea } from "./chart-area";
export type { ChartXAxisProps, ChartYAxisProps } from "./chart-axis";
export { ChartXAxis, ChartYAxis } from "./chart-axis";
export type { ChartBarProps } from "./chart-bar";
export { ChartBar } from "./chart-bar";
// Core
export { ChartContext, useChart } from "./chart-context";
export type { ChartEmptyProps } from "./chart-empty";
// State Components
export { ChartEmpty } from "./chart-empty";
export type { ChartGridProps } from "./chart-grid";
// Layout Components
export { ChartGrid } from "./chart-grid";
export type { ChartLabelProps } from "./chart-label";
// Annotation Components
export { ChartLabel } from "./chart-label";
export type { ChartLegendProps } from "./chart-legend";
export { ChartLegend, ChartLegendContent } from "./chart-legend";
export type { ChartLineProps, DotProps } from "./chart-line";
// Series Components
export { ChartLine } from "./chart-line";
export type { ChartLoadingProps } from "./chart-loading";
export { ChartLoading } from "./chart-loading";
export type { ChartReferenceLineProps } from "./chart-reference-line";

export { ChartReferenceLine } from "./chart-reference-line";
export type { ChartRootProps } from "./chart-root";
export { ChartRoot } from "./chart-root";
export type {
  ChartTooltipContentProps,
  ChartTooltipProps,
} from "./chart-tooltip";
// Interactive Components
export { ChartTooltip, ChartTooltipContent } from "./chart-tooltip";
// Types
export type {
  ChartConfig,
  ChartDimensions,
  ChartMargin,
  DataPoint,
  SeriesConfig,
} from "./types";
export type { ExportChartOptions, ExportDataOptions } from "./utils/export";
// Utilities
export { exportChart, exportChartData } from "./utils/export";
