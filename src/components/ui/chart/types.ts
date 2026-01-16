import type { ScaleBand, ScaleLinear, ScaleTime } from "d3-scale";
import type { Accessor, Component, JSX } from "solid-js";

/**
 * Data point for charts - supports time series, categorical, and numeric x-axis
 */
export type DataPoint = {
  date?: Date;
  category?: string;
  x?: number;
  [key: string]: number | string | Date | undefined;
};

/**
 * Chart margin configuration
 */
export type ChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Computed chart dimensions
 */
export type ChartDimensions = {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: ChartMargin;
};

/**
 * Configuration for individual data series
 */
export type ChartSeriesConfig = {
  label: string;
  color?: string;
  icon?: Component;
  yAxisId?: "left" | "right";
};

/**
 * Chart configuration mapping data keys to series config
 */
export type ChartConfig = {
  [key: string]: ChartSeriesConfig;
};

/**
 * Scale types used in charts
 */
export type XScale =
  | ScaleTime<number, number>
  | ScaleBand<string>
  | ScaleLinear<number, number>;
export type YScale = ScaleLinear<number, number>;

/**
 * Animation configuration
 */
export type ChartAnimation = {
  duration: number;
  easing: string;
};

/**
 * Tooltip data for display
 */
export type TooltipData = {
  label: string;
  items: Array<{
    key: string;
    label: string;
    value: number;
    color: string;
  }>;
  position: { x: number; y: number };
};

/**
 * Chart context values provided to child components
 */
export type ChartContextValue = {
  // Dimensions
  dimensions: Accessor<ChartDimensions>;

  // Data
  data: Accessor<DataPoint[]>;
  config: Accessor<ChartConfig>;

  // Scales
  xScale: Accessor<XScale>;
  yScale: Accessor<YScale>;
  yScaleRight: Accessor<YScale | null>;
  colorScale: Accessor<(key: string) => string>;

  // X-axis configuration
  xKey: Accessor<string>;
  xType: Accessor<"time" | "band" | "linear">;

  // Active data keys for series
  dataKeys: Accessor<string[]>;
  setDataKeys: (keys: string[]) => void;

  // Hidden series (for legend toggle)
  hiddenSeries: Accessor<Set<string>>;
  toggleSeries: (key: string) => void;

  // Interaction state
  hoveredPoint: Accessor<DataPoint | null>;
  hoveredIndex: Accessor<number | null>;
  selectedPoints: Accessor<DataPoint[]>;
  brushExtent: Accessor<[Date, Date] | null>;

  // Mouse position for tooltip
  mousePosition: Accessor<{ x: number; y: number } | null>;

  // Actions
  setHoveredPoint: (point: DataPoint | null, index: number | null) => void;
  setSelectedPoints: (points: DataPoint[]) => void;
  setBrushExtent: (extent: [Date, Date] | null) => void;
  setMousePosition: (pos: { x: number; y: number } | null) => void;

  // Animation
  animate: Accessor<ChartAnimation | false>;

  // Refs
  svgRef: Accessor<SVGSVGElement | undefined>;
  setSvgRef: (ref: SVGSVGElement | undefined) => void;
};

/**
 * Props for ChartRoot component
 */
export type ChartRootProps = {
  data: DataPoint[];
  config?: ChartConfig;
  width?: number;
  height?: number;
  margin?: Partial<ChartMargin>;
  xKey?: string;
  animate?: ChartAnimation | boolean;
  class?: string;
  children?: JSX.Element;
};

/**
 * Curve interpolation types
 */
export type CurveType = "natural" | "linear" | "step";

/**
 * Stacking modes
 */
export type StackType = "none" | "stacked" | "expanded";

/**
 * Dot configuration for line/area charts
 */
export type DotProps = {
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

/**
 * Tick format presets
 */
export type TickFormatPreset = "date" | "number" | "percent" | "currency";
export type TickFormatter = (value: unknown) => string;
export type TickFormat = TickFormatPreset | TickFormatter;
