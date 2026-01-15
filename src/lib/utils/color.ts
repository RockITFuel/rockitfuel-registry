import type { JSX } from "solid-js";

/**
 * Converts a color string to contrasting text color (black or white)
 * Based on luminance calculation
 */
function getContrastColor(color: string): string {
  // Convert hex to RGB
  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = Number.parseInt(hex[0] + hex[0], 16);
      g = Number.parseInt(hex[1] + hex[1], 16);
      b = Number.parseInt(hex[2] + hex[2], 16);
    } else {
      r = Number.parseInt(hex.slice(0, 2), 16);
      g = Number.parseInt(hex.slice(2, 4), 16);
      b = Number.parseInt(hex.slice(4, 6), 16);
    }
  } else if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      r = Number.parseInt(match[0], 10);
      g = Number.parseInt(match[1], 10);
      b = Number.parseInt(match[2], 10);
    } else {
      return "#000000";
    }
  } else if (color.startsWith("hsl")) {
    // For HSL, default to black text - could be enhanced
    return "#000000";
  } else {
    return "#000000";
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Generates CSS styles for a colored chip/badge
 * Returns background color and appropriate contrasting text color
 */
export function getColorStyles(color: string): JSX.CSSProperties {
  return {
    "background-color": color,
    color: getContrastColor(color),
  };
}
