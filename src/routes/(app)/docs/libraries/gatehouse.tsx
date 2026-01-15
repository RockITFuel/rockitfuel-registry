import { Title } from "@solidjs/meta";
import { CodeBlock } from "~/components/code-block";
import { InstallCommand } from "~/components/install-command";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { GatehouseDemo } from "~/registry/new-york/blocks/gatehouse-demo/page";

const usageExample = `import { Gatehouse, RBACPolicy, ABACPolicy } from "~/lib/gatehouse"

// Create a Gatehouse instance
const gatehouse = new Gatehouse()

// Define an RBAC policy
const rbacPolicy = new RBACPolicy({
  roles: {
    admin: { permissions: ["read", "write", "delete"] },
    editor: { permissions: ["read", "write"] },
    viewer: { permissions: ["read"] }
  }
})

// Define an ABAC policy
const abacPolicy = new ABACPolicy({
  rules: [
    {
      effect: "allow",
      condition: (ctx) => ctx.user.department === ctx.resource.department
    }
  ]
})

// Add policies to Gatehouse
gatehouse.addPolicy(rbacPolicy)
gatehouse.addPolicy(abacPolicy)

// Check authorization
const result = await gatehouse.isAuthorized({
  user: { id: "1", role: "editor", department: "engineering" },
  action: "write",
  resource: { id: "doc-1", department: "engineering" }
})`;

export default function GatehousePage() {
  return (
    <>
      <Title>Gatehouse - ArchiTechs Registry</Title>

      <PageHeader>
        <PageHeaderHeading>Gatehouse</PageHeaderHeading>
        <PageHeaderDescription>
          A flexible, zero-dependencies authorization TypeScript library
          supporting RBAC, ABAC, and ReBAC. Based on gatehouse-ts by 9Morello.
        </PageHeaderDescription>
      </PageHeader>

      <div class="space-y-8">
        <section>
          <h2 class="mb-4 font-semibold text-xl">Installation</h2>
          <InstallCommand component="gatehouse" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Features</h2>
          <ul class="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong>RBAC (Role-Based Access Control)</strong> - Define roles
              and permissions
            </li>
            <li>
              <strong>ABAC (Attribute-Based Access Control)</strong> - Policies
              based on user/resource attributes
            </li>
            <li>
              <strong>ReBAC (Relationship-Based Access Control)</strong> -
              Permissions based on entity relationships
            </li>
            <li>Zero dependencies</li>
            <li>TypeScript-first with full type safety</li>
            <li>Flexible policy composition</li>
          </ul>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Interactive Demo</h2>
          <p class="mb-4 text-muted-foreground text-sm">
            Try the interactive demo below to see how Gatehouse evaluates
            authorization policies.
          </p>
          <div class="rounded-md border bg-muted/50 p-4">
            <GatehouseDemo />
          </div>
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Basic Usage</h2>
          <CodeBlock code={usageExample} lang="typescript" />
        </section>

        <section>
          <h2 class="mb-4 font-semibold text-xl">Credits</h2>
          <p class="text-muted-foreground">
            Based on{" "}
            <a
              class="font-medium underline underline-offset-4"
              href="https://github.com/9Morello/gatehouse-ts"
              rel="noreferrer"
              target="_blank"
            >
              gatehouse-ts
            </a>{" "}
            by 9Morello.
          </p>
        </section>
      </div>
    </>
  );
}
