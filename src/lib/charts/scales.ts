import {
  extent,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scalePoint,
  scaleTime,
} from "d3";
import type {
  BandScale,
  ChartDimensions,
  LinearScale,
  PointScale,
  TimeScale,
} from "./types";

/**
 * Create a linear scale for numeric data
 */
export function createLinearScale(
  domain: [number, number],
  range: [number, number],
  options?: {
    nice?: boolean;
    clamp?: boolean;
  }
): LinearScale {
  const scale = scaleLinear().domain(domain).range(range);

  if (options?.nice) {
    scale.nice();
  }

  if (options?.clamp) {
    scale.clamp(true);
  }

  return scale;
}

/**
 * Create a time scale for date/time data
 */
export function createTimeScale(
  domain: [Date, Date],
  range: [number, number],
  options?: {
    nice?: boolean;
    clamp?: boolean;
  }
): TimeScale {
  const scale = scaleTime().domain(domain).range(range);

  if (options?.nice) {
    scale.nice();
  }

  if (options?.clamp) {
    scale.clamp(true);
  }

  return scale;
}

/**
 * Create a band scale for categorical data (bar charts)
 */
export function createBandScale(
  domain: string[],
  range: [number, number],
  options?: {
    padding?: number;
    paddingInner?: number;
    paddingOuter?: number;
    align?: number;
  }
): BandScale {
  const scale = scaleBand().domain(domain).range(range);

  if (options?.padding !== undefined) {
    scale.padding(options.padding);
  }

  if (options?.paddingInner !== undefined) {
    scale.paddingInner(options.paddingInner);
  }

  if (options?.paddingOuter !== undefined) {
    scale.paddingOuter(options.paddingOuter);
  }

  if (options?.align !== undefined) {
    scale.align(options.align);
  }

  return scale;
}

/**
 * Create a point scale for categorical data (scatter/line charts)
 */
export function createPointScale(
  domain: string[],
  range: [number, number],
  options?: {
    padding?: number;
    align?: number;
  }
): PointScale {
  const scale = scalePoint().domain(domain).range(range);

  if (options?.padding !== undefined) {
    scale.padding(options.padding);
  }

  if (options?.align !== undefined) {
    scale.align(options.align);
  }

  return scale;
}

/**
 * Create a color scale from a domain to a color range
 */
export function createColorScale<T extends string>(
  domain: string[],
  colors: readonly T[]
): ReturnType<typeof scaleOrdinal<string, T>> {
  return scaleOrdinal<string, T>()
    .domain(domain)
    .range([...colors] as T[]);
}

/**
 * Calculate chart dimensions from container size and margins
 */
export function calculateDimensions(
  width: number,
  height: number,
  margin: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }> = {}
): ChartDimensions {
  const defaultMargin = {
    top: margin.top ?? 20,
    right: margin.right ?? 20,
    bottom: margin.bottom ?? 40,
    left: margin.left ?? 50,
  };

  return {
    width,
    height,
    margin: defaultMargin,
    innerWidth: Math.max(0, width - defaultMargin.left - defaultMargin.right),
    innerHeight: Math.max(0, height - defaultMargin.top - defaultMargin.bottom),
  };
}

/**
 * Compute domain extent for numeric data with optional padding
 */
export function computeNumericExtent(
  data: number[],
  padding = 0
): [number, number] {
  const dataExtent = extent(data) as [number, number];
  if (padding === 0) {
    return dataExtent;
  }

  const range = dataExtent[1] - dataExtent[0];
  return [dataExtent[0] - range * padding, dataExtent[1] + range * padding];
}

/**
 * Compute domain extent for time data
 */
export function computeTimeExtent(data: Date[]): [Date, Date] {
  return extent(data) as [Date, Date];
}

/**
 * Get nice tick values for a linear scale
 */
export function getNiceTickValues(scale: LinearScale, count = 5): number[] {
  return scale.ticks(count);
}

/**
 * Get nice tick values for a time scale
 */
export function getNiceTimeTickValues(scale: TimeScale, count = 5): Date[] {
  return scale.ticks(count);
}
