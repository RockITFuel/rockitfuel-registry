# Feature: Navbar Enhancements

## Overview

Enhance the top navigation bar to better match shadcn/ui's design with improved spacing, active states, and visual polish.

## Current State

- Logo + brand name
- Main nav links (Docs, Components, Blocks, Libraries)
- Search button
- GitHub link
- Theme toggle
- Mobile menu trigger

## Desired State

- Refined link styling and spacing
- Better active state indicators
- Consistent hover effects
- Optional: GitHub stars badge (like shadcn shows "105k")
- Clean separation between navigation areas

## Implementation Steps

### 1. Update Main Nav Links Styling

```tsx
<nav class="flex items-center gap-1 text-sm">
  <For each={docsConfig.mainNav}>
    {(item) => (
      <A
        href={item.href}
        class={cn(
          "px-3 py-2 rounded-md transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive(item.href)
            ? "text-foreground font-medium"
            : "text-muted-foreground"
        )}
      >
        {item.title}
      </A>
    )}
  </For>
</nav>
```

### 2. Improve Logo Area

```tsx
<A href="/" class="mr-6 flex items-center gap-2 group">
  <IconLogo class="size-6 transition-transform group-hover:scale-105" />
  <span class="hidden font-bold text-lg tracking-tight sm:inline-block">
    ArchiTechs
  </span>
</A>
```

### 3. Add GitHub Stars Badge (Optional)

Fetch and display GitHub stars:

```tsx
// In navbar or as separate component
const [stars, setStars] = createSignal<string | null>(null);

onMount(async () => {
  try {
    const res = await fetch("https://api.github.com/repos/RockITFuel/rockitfuel-registry");
    const data = await res.json();
    const count = data.stargazers_count;
    setStars(count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));
  } catch {
    // Silently fail
  }
});

// In render:
<A
  href="https://github.com/RockITFuel/rockitfuel-registry"
  target="_blank"
  rel="noreferrer"
  class={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
>
  <IconBrandGithub class="size-4" />
  <Show when={stars()}>
    <span class="text-xs font-medium">{stars()}</span>
  </Show>
</A>
```

### 4. Improve Right Side Actions

```tsx
<div class="flex items-center gap-1">
  <SearchButton />
  <A
    href="https://github.com/RockITFuel/rockitfuel-registry"
    target="_blank"
    rel="noreferrer"
    class={cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "size-9"
    )}
  >
    <IconBrandGithub class="size-5" />
    <span class="sr-only">GitHub</span>
  </A>
  <ModeToggle />
</div>
```

### 5. Ensure Consistent Container Width

```tsx
<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-14 max-w-screen-2xl items-center">
    {/* Content */}
  </div>
</header>
```

### 6. Add Skip Link for Accessibility

```tsx
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md"
>
  Skip to main content
</a>
```

## Visual Design Specifications

| Element | Value |
|---------|-------|
| Header height | 56px (h-14) |
| Logo size | 24px |
| Brand font | 18px, bold |
| Nav link font | 14px |
| Nav link padding | 12px 12px |
| Border radius | 6px |
| Gap between links | 4px |
| Icon button size | 36px |
| Transition | 150ms |

## Files to Modify

- `src/components/navbar.tsx`
- `src/components/mode-toggle.tsx` (ensure consistency)

## Dependencies

None

## Testing

- Test all nav links work correctly
- Test active states highlight properly
- Test hover effects
- Test GitHub stars fetch (with fallback)
- Test mobile responsiveness
- Test keyboard navigation
- Test skip link functionality
- Test in dark mode
