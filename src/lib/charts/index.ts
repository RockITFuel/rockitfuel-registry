/** biome-ignore-all lint/performance/noBarrelFile: public API entry point for chart utilities */

// Axis utilities
export {
  createAxisGenerator,
  createGridLines,
  getTickFormat,
  renderAxis,
  styleAxis,
  styleGridLines,
} from "./axis";
// Formatting utilities
export {
  createAbbreviatedFormatter,
  formatBytes,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatFullDate,
  formatISODate,
  formatNumber,
  formatOrdinal,
  formatPercent,
  formatRange,
  formatShortDate,
  formatSI,
  formatTime,
  parseDate,
  parseISODate,
  truncateLabel,
} from "./format";
// Resize/responsive utilities
export {
  getDevicePixelRatio,
  getElementBounds,
  isElementVisible,
  scaleCanvas,
  setSvgViewBox,
  useChartDimensions,
  useResizeObserver,
} from "./resize";
// Scale utilities
export {
  calculateDimensions,
  computeNumericExtent,
  computeTimeExtent,
  createBandScale,
  createColorScale,
  createLinearScale,
  createPointScale,
  createTimeScale,
  getNiceTickValues,
  getNiceTimeTickValues,
} from "./scales";
// Theme utilities
export {
  categoricalPalette,
  chartStyles,
  defaultColorPalette,
  divergingPalette,
  extendedColorPalette,
  getChartTheme,
  getColorFromPalette,
  getCssVariable,
  isDarkMode,
  sequentialPalette,
  withOpacity,
} from "./theme";
// Tooltip utilities
export {
  bisectIndex,
  calculateTooltipPosition,
  findClosestPoint,
  findClosestPointByX,
  getRelativeMousePosition,
  useChartTooltip,
} from "./tooltip";
export type {
  AxisConfig,
  AxisOrientation,
  BandScale,
  CategoryPoint,
  ChartColorPalette,
  ChartDimensions,
  ChartMargin,
  ChartTheme,
  DataPoint,
  LinearScale,
  OrdinalScale,
  PointScale,
  TimeScale,
  TimeSeriesPoint,
  TooltipData,
} from "./types";
