import { Title } from "@solidjs/meta";
import { PokemonPage } from "@/registry/new-york/blocks/complex-component/page";
import { ExampleForm } from "@/registry/new-york/blocks/example-form/example-form";
import { ExampleCard } from "@/registry/new-york/blocks/example-with-css/example-card";
import { HelloWorld } from "@/registry/new-york/blocks/hello-world/hello-world";
import { GatehouseDemo } from "@/registry/new-york/blocks/gatehouse-demo/page";

export default function Home() {
  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <Title>RockITFuel Registry - SolidJS</Title>

      <header class="mb-8">
        <h1 class="font-bold text-3xl">RockITFuel Registry</h1>
        <p class="mt-2 text-muted-foreground">
          A custom component registry for SolidJS powered by shadcn - featuring
          the Gatehouse authorization library.
        </p>
        <p class="mt-2 text-sm text-muted-foreground">
          Add components via:{" "}
          <code class="rounded bg-muted px-1 py-0.5">
            npx shadcn@latest add https://solid-registry.coolify.wearearchitechs.dev/r/[component].json
          </code>
        </p>
      </header>

      <div class="flex flex-col gap-8">
        {/* Gatehouse Demo - Featured */}
        <section class="rounded-lg border-2 border-primary/50 p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <div class="mb-1 flex items-center gap-2">
                <h2 class="font-semibold text-lg">Gatehouse Demo</h2>
                <span class="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  Featured
                </span>
              </div>
              <p class="text-muted-foreground text-sm">
                Interactive authorization demo with RBAC, ABAC, and ReBAC policies
              </p>
              <code class="mt-1 block text-muted-foreground text-xs">
                npx shadcn@latest add https://solid-registry.coolify.wearearchitechs.dev/r/gatehouse.json
              </code>
            </div>
          </div>
          <div class="rounded-md border bg-muted/50 p-4">
            <GatehouseDemo />
          </div>
        </section>

        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">HelloWorld</h2>
              <p class="text-muted-foreground text-sm">
                A simple hello world component
              </p>
            </div>
          </div>
          <div class="flex min-h-[200px] items-center justify-center rounded-md border bg-muted/50">
            <HelloWorld />
          </div>
        </section>

        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">ExampleForm</h2>
              <p class="text-muted-foreground text-sm">
                A contact form with Zod validation
              </p>
            </div>
          </div>
          <div class="flex min-h-[450px] items-center justify-center rounded-md border bg-muted/50 p-4">
            <ExampleForm />
          </div>
        </section>

        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">PokemonPage</h2>
              <p class="text-muted-foreground text-sm">
                A complex component showing hooks, libs and components
              </p>
            </div>
          </div>
          <div class="min-h-[450px] rounded-md border bg-muted/50 p-4">
            <PokemonPage />
          </div>
        </section>

        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">ExampleCard</h2>
              <p class="text-muted-foreground text-sm">
                A login form with a CSS file
              </p>
            </div>
          </div>
          <div class="flex min-h-[450px] items-center justify-center rounded-md border bg-muted/50">
            <ExampleCard />
          </div>
        </section>
      </div>

      <footer class="mt-12 border-t pt-6 text-center text-muted-foreground text-sm">
        <p>
          Built by{" "}
          <a
            href="https://github.com/RockITFuel"
            class="underline hover:text-foreground"
          >
            RockITFuel
          </a>
          . Gatehouse-TS by{" "}
          <a
            href="https://github.com/9Morello/gatehouse-ts"
            class="underline hover:text-foreground"
          >
            9Morello
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
