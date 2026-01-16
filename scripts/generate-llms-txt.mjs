/**
 * Generates llms.txt - a machine-readable documentation file for AI/LLM consumption
 * Run: node scripts/generate-llms-txt.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT_DIR, "public/r");
const OUTPUT_FILE = path.join(ROOT_DIR, "public/llms.txt");

const REGISTRY_URL = "https://solid-registry.coolify.wearearchitechs.dev";

/**
 * Load the main registry index
 */
function loadRegistry() {
  const registryPath = path.join(REGISTRY_DIR, "registry.json");
  const content = fs.readFileSync(registryPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Load individual component JSON to get dependencies
 */
function loadComponentDetails(name) {
  const componentPath = path.join(REGISTRY_DIR, `${name}.json`);
  if (!fs.existsSync(componentPath)) {
    return null;
  }
  const content = fs.readFileSync(componentPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Get human-readable type label
 */
function getTypeLabel(type) {
  const labels = {
    "registry:ui": "UI Component",
    "registry:lib": "Library",
    "registry:hook": "Hook",
    "registry:block": "Block",
    "registry:modular": "Form Components",
  };
  return labels[type] || type;
}

/**
 * Generate the llms.txt content
 */
function generateLlmsTxt() {
  const registry = loadRegistry();

  const lines = [
    "# ArchiTechs Registry - Component Documentation",
    "",
    "A SolidJS component registry (shadcn/ui style) for distributing reusable components,",
    "form blocks, libraries, and hooks via CLI installation.",
    "",
    "## Quick Start",
    "",
    "Initialize shadcn in your SolidJS project:",
    "```bash",
    "bunx shadcn@latest init",
    "```",
    "",
    "Install any component:",
    "```bash",
    `bunx shadcn@latest add ${REGISTRY_URL}/r/<component-name>.json`,
    "```",
    "",
    "---",
    "",
  ];

  // Group items by type
  const grouped = {};
  for (const item of registry.items) {
    const typeLabel = getTypeLabel(item.type);
    if (!grouped[typeLabel]) {
      grouped[typeLabel] = [];
    }
    grouped[typeLabel].push(item);
  }

  // Generate sections for each type
  const typeOrder = [
    "UI Component",
    "Block",
    "Form Components",
    "Library",
    "Hook",
  ];

  for (const typeLabel of typeOrder) {
    const items = grouped[typeLabel];
    if (!items || items.length === 0) continue;

    lines.push(`## ${typeLabel}s`);
    lines.push("");

    for (const item of items) {
      const details = loadComponentDetails(item.name);
      const deps = details?.dependencies || [];

      lines.push(`### ${item.title}`);
      lines.push("");
      lines.push(`**Name:** ${item.name}`);
      lines.push(`**Description:** ${item.description}`);
      lines.push(
        `**Install:** \`bunx shadcn@latest add ${REGISTRY_URL}/r/${item.name}.json\``
      );

      if (deps.length > 0) {
        lines.push(`**Dependencies:** ${deps.join(", ")}`);
      }

      lines.push("");
    }
  }

  // Add footer
  lines.push("---");
  lines.push("");
  lines.push("## Links");
  lines.push("");
  lines.push(`- Website: ${REGISTRY_URL}`);
  lines.push("- Based on: solid-ui (https://solid-ui.com)");
  lines.push("- Styling: Tailwind CSS + Kobalte primitives");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString().split("T")[0]}`);

  return lines.join("\n");
}

// Main execution
try {
  const content = generateLlmsTxt();
  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log(`  Size: ${(content.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error("Error generating llms.txt:", error);
  process.exit(1);
}
