import type { ChartColorPalette, ChartTheme } from "./types";

/**
 * CSS variable to HSL value converter
 */
function cssVarToHsl(varName: string): string {
  return `hsl(var(${varName}))`;
}

/**
 * Get computed CSS variable value from the document
 */
export function getCssVariable(varName: string): string {
  if (typeof document === "undefined") {
    return "";
  }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

/**
 * Check if dark mode is active
 */
export function isDarkMode(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return (
    document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-kb-theme") === "dark"
  );
}

/**
 * Get chart theme colors from CSS variables
 */
export function getChartTheme(): ChartTheme {
  return {
    primary: cssVarToHsl("--primary"),
    secondary: cssVarToHsl("--secondary"),
    foreground: cssVarToHsl("--foreground"),
    muted: cssVarToHsl("--muted"),
    mutedForeground: cssVarToHsl("--muted-foreground"),
    background: cssVarToHsl("--background"),
    border: cssVarToHsl("--border"),
    accent: cssVarToHsl("--accent"),
    destructive: cssVarToHsl("--destructive"),
    success: cssVarToHsl("--success-foreground"),
    warning: cssVarToHsl("--warning-foreground"),
    info: cssVarToHsl("--info-foreground"),
  };
}

/**
 * Default chart color palette using theme-aware colors
 */
export const defaultColorPalette: ChartColorPalette = [
  "hsl(var(--primary))",
  "hsl(var(--info-foreground))",
  "hsl(var(--success-foreground))",
  "hsl(var(--warning-foreground))",
  "hsl(var(--destructive))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--muted-foreground))",
] as const;

/**
 * Extended color palette for charts with many categories
 */
export const extendedColorPalette: ChartColorPalette = [
  "hsl(var(--primary))",
  "hsl(var(--info-foreground))",
  "hsl(var(--success-foreground))",
  "hsl(var(--warning-foreground))",
  "hsl(var(--destructive))",
  "hsl(220, 70%, 50%)", // Blue
  "hsl(280, 65%, 60%)", // Purple
  "hsl(340, 75%, 55%)", // Pink
  "hsl(170, 60%, 45%)", // Teal
  "hsl(30, 80%, 55%)", // Orange
] as const;

/**
 * Categorical color palette (colorblind-friendly)
 */
export const categoricalPalette: ChartColorPalette = [
  "#2271B3", // Blue
  "#D55E00", // Vermillion
  "#009E73", // Bluish green
  "#CC79A7", // Reddish purple
  "#F0E442", // Yellow
  "#56B4E9", // Sky blue
  "#E69F00", // Orange
  "#0072B2", // Blue
] as const;

/**
 * Sequential color palette for gradients
 */
export const sequentialPalette: ChartColorPalette = [
  "hsl(var(--primary) / 0.1)",
  "hsl(var(--primary) / 0.3)",
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--primary) / 0.9)",
  "hsl(var(--primary))",
] as const;

/**
 * Diverging color palette for data with a midpoint
 */
export const divergingPalette: ChartColorPalette = [
  "hsl(var(--destructive))",
  "hsl(var(--destructive) / 0.7)",
  "hsl(var(--destructive) / 0.4)",
  "hsl(var(--muted))",
  "hsl(var(--success-foreground) / 0.4)",
  "hsl(var(--success-foreground) / 0.7)",
  "hsl(var(--success-foreground))",
] as const;

/**
 * Get a color from a palette by index (cycles if index exceeds length)
 */
export function getColorFromPalette(
  index: number,
  palette: ChartColorPalette = defaultColorPalette
): string {
  return palette[index % palette.length];
}

// Top-level regex for performance
const HSL_VAR_REGEX = /hsl\(var\((--[^)]+)\)\)/;

/**
 * Generate a color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Handle HSL CSS variables
  if (color.startsWith("hsl(var(")) {
    const varMatch = color.match(HSL_VAR_REGEX);
    if (varMatch) {
      return `hsl(var(${varMatch[1]}) / ${opacity})`;
    }
  }
  // Handle regular HSL
  if (color.startsWith("hsl(")) {
    return color.replace(")", ` / ${opacity})`).replace("hsl(", "hsla(");
  }
  // Handle hex colors
  if (color.startsWith("#")) {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${alpha}`;
  }
  return color;
}

/**
 * Chart styling presets
 */
export const chartStyles = {
  axis: {
    line: "hsl(var(--border))",
    text: "hsl(var(--muted-foreground))",
    fontSize: "12px",
  },
  grid: {
    line: "hsl(var(--border))",
    opacity: 0.5,
  },
  tooltip: {
    background: "hsl(var(--popover))",
    border: "hsl(var(--border))",
    text: "hsl(var(--popover-foreground))",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  animation: {
    duration: 300,
    easing: "ease-out",
  },
} as const;
