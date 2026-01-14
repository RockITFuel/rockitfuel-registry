import type {
  ScaleBand,
  ScaleLinear,
  ScaleOrdinal,
  ScalePoint,
  ScaleTime,
} from "d3";

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
 * Chart dimensions including margins
 */
export type ChartDimensions = {
  width: number;
  height: number;
  margin: ChartMargin;
  innerWidth: number;
  innerHeight: number;
};

/**
 * Common data point structure
 */
export type DataPoint = {
  x: number | string | Date;
  y: number;
  label?: string;
};

/**
 * Time series data point
 */
export type TimeSeriesPoint = {
  date: Date;
  value: number;
  label?: string;
};

/**
 * Category data point for bar/pie charts
 */
export type CategoryPoint = {
  category: string;
  value: number;
  color?: string;
};

/**
 * Scale types supported by the utilities
 */
export type LinearScale = ScaleLinear<number, number>;
export type TimeScale = ScaleTime<number, number>;
export type BandScale = ScaleBand<string>;
export type OrdinalScale<T> = ScaleOrdinal<string, T>;
export type PointScale = ScalePoint<string>;

/**
 * Axis orientation
 */
export type AxisOrientation = "top" | "right" | "bottom" | "left";

/**
 * Axis configuration
 */
export type AxisConfig = {
  orientation: AxisOrientation;
  tickCount?: number;
  tickFormat?: (value: unknown) => string;
  tickSize?: number;
  tickPadding?: number;
  label?: string;
  labelOffset?: number;
};

/**
 * Tooltip data for chart interactions
 */
export type TooltipData<T = unknown> = {
  x: number;
  y: number;
  data: T;
  visible: boolean;
};

/**
 * Chart theme colors derived from CSS variables
 */
export type ChartTheme = {
  primary: string;
  secondary: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  background: string;
  border: string;
  accent: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
};

/**
 * Default chart color palette
 */
export type ChartColorPalette = readonly string[];
