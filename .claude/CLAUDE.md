# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun install          # Install dependencies
bun dev              # Start dev server on port 4999

# Building
bun build            # Production build (also generates llms.txt)
bun build:registry   # Generate registry JSON files to public/r/

# Code Quality
bun run format       # Format with Ultracite (Biome)
bun run lint         # Check for issues

# Testing
bun test:e2e         # Run Playwright E2E tests
bun test:e2e:ui      # Run E2E tests with UI
```

## Codebase Overview

A **SolidJS component registry website** (similar to shadcn/ui) for distributing reusable components, form blocks, libraries, and hooks via CLI installation.

**Stack**: SolidJS + SolidStart, Tailwind CSS + CVA, Kobalte primitives, D3 charts, Convex (optional)

**Structure**:
- `src/components/ui/` - 50+ accessible UI components
- `src/components/super-form/` - Modular-forms integration
- `src/lib/` - Gatehouse auth, chart utilities, Convex hooks
- `src/hooks/` - Custom hooks (useBindSignal, useLoading, etc.)
- `src/routes/(app)/docs/` - Documentation pages
- `public/r/` - Registry JSON for CLI installation

For detailed architecture, see [docs/CODEBASE_MAP.md](../docs/CODEBASE_MAP.md).

## Key Architecture Notes

**SSR is disabled** - `app.config.ts` has `ssr: false`. All rendering is client-side. Use `onMount` for client-only code.

**Path aliases** - Both `@/` and `~/` map to `src/`.

**Component patterns**:
```tsx
// Standard SolidJS component structure
export function MyComponent(props: MyComponentProps) {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div class={cn(variants({ variant: local.variant }), local.class)} {...others}>
      {props.children}
    </div>
  );
}
```

**Modular-forms integration** - Requires manual event dispatching since Kobalte components don't trigger native events:
```tsx
const handleChange = (e: Event) => {
  e.target.dispatchEvent(new Event("input", { bubbles: true }));
};
```

## Adding New Items

**New UI component**: Create `src/components/ui/[name].tsx` → Add to `src/registry/new-york/ui/` → Run `bun build:registry` → Add docs at `src/routes/(app)/docs/components/[name].tsx` → Update `src/config/docs.ts`

**New library/hook**: Create in `src/lib/` or `src/hooks/` → Add docs → Update `src/config/docs.ts`

---

## Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset. Run `bun run format` before committing.

### SolidJS Specifics

- Use `class` and `for` attributes (not `className` or `htmlFor`)
- Use `splitProps` to extract local props before spreading to elements
- Initialize refs as `undefined` (not `null`) due to SolidJS ref semantics
- Use `createSignal`, `createEffect`, `createMemo` for reactivity
- Call hooks at the top level only, never conditionally

### General Guidelines

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any`, use const assertions for immutable values
- Use `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Use `const` by default, `let` only when reassignment is needed
- Prefer early returns over nested conditionals
- Use semantic HTML and ARIA attributes for accessibility
