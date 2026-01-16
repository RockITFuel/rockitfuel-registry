import { createContext, useContext } from "solid-js";
import type { ChartContextValue } from "./types";

/**
 * Chart context for sharing state between chart components
 */
export const ChartContext = createContext<ChartContextValue | undefined>(
  undefined
);

/**
 * Hook to access chart context - throws if used outside ChartRoot
 */
export function useChart(): ChartContextValue {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartRoot component");
  }
  return context;
}

/**
 * Hook to optionally access chart context - returns undefined if outside ChartRoot
 */
export function useChartOptional(): ChartContextValue | undefined {
  return useContext(ChartContext);
}
