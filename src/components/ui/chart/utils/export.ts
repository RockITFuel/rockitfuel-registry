import type { DataPoint } from "../types";

export type ExportChartOptions = {
  /** Export format */
  format: "png" | "svg";
  /** Output filename */
  filename?: string;
  /** Scale factor for PNG (default: 2 for retina) */
  scale?: number;
  /** Background color (default: transparent) */
  backgroundColor?: string;
};

export type ExportDataOptions = {
  /** Output filename */
  filename?: string;
  /** Columns to include (default: all) */
  columns?: string[];
  /** Include header row */
  includeHeader?: boolean;
  /** Date format function */
  dateFormatter?: (date: Date) => string;
};

/**
 * Export chart as PNG or SVG image
 *
 * @param svgElement - The SVG element to export
 * @param options - Export options
 */
export async function exportChart(
  svgElement: SVGSVGElement,
  options: ExportChartOptions
): Promise<void> {
  const { format, filename, scale = 2, backgroundColor } = options;

  // Clone the SVG to avoid modifying the original
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Get dimensions
  const bbox = svgElement.getBoundingClientRect();
  const width = bbox.width;
  const height = bbox.height;

  // Set explicit dimensions
  clonedSvg.setAttribute("width", String(width));
  clonedSvg.setAttribute("height", String(height));

  // Add background if specified
  if (backgroundColor) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", backgroundColor);
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);
  }

  // Inline styles for export
  inlineStyles(clonedSvg);

  // Serialize SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });

  if (format === "svg") {
    // Download as SVG
    downloadBlob(svgBlob, filename ?? "chart.svg");
    return;
  }

  // Convert to PNG
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create canvas with scaled dimensions
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Fill background if specified
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw scaled image
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, filename ?? "chart.png");
          resolve();
        } else {
          reject(new Error("Could not create PNG blob"));
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load SVG for conversion"));
    };

    img.src = url;
  });
}

/**
 * Export chart data as CSV
 *
 * @param data - The data to export
 * @param options - Export options
 */
export function exportChartData(
  data: DataPoint[],
  options: ExportDataOptions = {}
): void {
  const {
    filename = "chart-data.csv",
    columns,
    includeHeader = true,
    dateFormatter = defaultDateFormatter,
  } = options;

  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Determine columns from first data point if not specified
  const keys = columns ?? Object.keys(data[0]);

  // Build CSV content
  const rows: string[] = [];

  // Header row
  if (includeHeader) {
    rows.push(keys.map(escapeCSV).join(","));
  }

  // Data rows
  for (const point of data) {
    const values = keys.map((key) => {
      const value = point[key];

      if (value === undefined || value === null) {
        return "";
      }

      if (value instanceof Date) {
        return escapeCSV(dateFormatter(value));
      }

      if (typeof value === "number") {
        return String(value);
      }

      return escapeCSV(String(value));
    });

    rows.push(values.join(","));
  }

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

/**
 * Inline computed styles into SVG elements for export
 */
function inlineStyles(element: Element): void {
  const computed = window.getComputedStyle(element);

  // Properties to inline
  const styleProps = [
    "fill",
    "stroke",
    "stroke-width",
    "stroke-dasharray",
    "opacity",
    "font-family",
    "font-size",
    "font-weight",
    "text-anchor",
    "dominant-baseline",
  ];

  for (const prop of styleProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== "none") {
      (element as SVGElement).style.setProperty(prop, value);
    }
  }

  // Recurse to children
  for (const child of element.children) {
    inlineStyles(child);
  }
}

/**
 * Escape a value for CSV
 */
function escapeCSV(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Default date formatter for CSV export
 */
function defaultDateFormatter(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
