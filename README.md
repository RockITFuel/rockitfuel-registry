# RockITFuel Registry

A custom shadcn component registry for **SolidJS** featuring the **Gatehouse** authorization library.

## Featured: Gatehouse Authorization Library

[Gatehouse-TS](https://github.com/9Morello/gatehouse-ts) is a flexible, zero-dependencies authorization TypeScript library supporting:

- **RBAC** (Role-Based Access Control) - Access based on user roles
- **ABAC** (Attribute-Based Access Control) - Access based on subject/resource attributes
- **ReBAC** (Relationship-Based Access Control) - Access based on relationships (e.g., ownership)
- **Policy Composition** - Combine policies with AND, OR, NOT operators
- **Detailed Evaluation Tracing** - Debug and audit authorization decisions

## Quick Start

Add Gatehouse to your SolidJS project:

```bash
npx shadcn@latest add https://solid-registry.coolify.wearearchitechs.dev/r/gatehouse.json
```

### Basic Usage

```typescript
import {
  buildRbacPolicy,
  PermissionChecker,
} from "@/lib/gatehouse";

// Define your types
type User = { id: number; roles: string[] };
type Document = { id: number; ownerId: number };
type Action = "read" | "write" | "delete";

// Create a role-based policy
const rbacPolicy = buildRbacPolicy<User, Document, Action, {}, string>({
  name: "RBAC Policy",
  requiredRolesResolver: (_, action) => {
    switch (action) {
      case "read": return ["viewer", "editor", "admin"];
      case "write": return ["editor", "admin"];
      case "delete": return ["admin"];
    }
  },
  userRolesResolver: (user) => user.roles,
});

// Create permission checker and add policy
const checker = new PermissionChecker<User, Document, Action, {}>();
checker.addPolicy(rbacPolicy);

// Check access
const result = await checker.evaluateAccess({
  subject: { id: 1, roles: ["editor"] },
  resource: { id: 101, ownerId: 2 },
  action: "write",
  context: {},
});

if (result.isGranted()) {
  console.log("Access granted!");
} else {
  console.log("Access denied:", result.getDisplayTrace());
}
```

## Available Components

| Component | Description | Install Command |
|-----------|-------------|-----------------|
| `gatehouse` | Authorization library (RBAC, ABAC, ReBAC) | `npx shadcn@latest add .../r/gatehouse.json` |
| `gatehouse-demo` | Interactive authorization demo | `npx shadcn@latest add .../r/gatehouse-demo.json` |
| `button` | Button component with variants | `npx shadcn@latest add .../r/button.json` |
| `card` | Card container component | `npx shadcn@latest add .../r/card.json` |
| `input` | Input component | `npx shadcn@latest add .../r/input.json` |
| `label` | Label component | `npx shadcn@latest add .../r/label.json` |
| `textarea` | Textarea component | `npx shadcn@latest add .../r/textarea.json` |
| `hello-world` | Simple example component | `npx shadcn@latest add .../r/hello-world.json` |
| `example-form` | Form with Zod validation | `npx shadcn@latest add .../r/example-form.json` |

Replace `...` with `https://solid-registry.coolify.wearearchitechs.dev`

## Development

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Node.js >= 18

### Installation

```bash
# Clone the repository
git clone https://github.com/RockITFuel/rockitfuel-registry.git
cd rockitfuel-registry

# Install dependencies
bun install

# Start development server
bun dev
```

### Building the Registry

```bash
# Build registry JSON files
bun build:registry

# Build for production
bun build
```

### Deployment (Coolify/Dokploy)

This registry includes a Dockerfile for easy deployment:

```bash
# Build Docker image
docker build -t rockitfuel-registry .

# Run locally
docker run -p 3000:3000 rockitfuel-registry
```

For Coolify/Dokploy, simply point to this repository and it will automatically detect the Dockerfile.

## Project Structure

```
rockitfuel-registry/
├── public/r/                    # Generated registry JSON files
├── scripts/
│   └── build-registry.mjs       # Registry build script
├── src/
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (cn)
│   │   └── gatehouse.ts         # Gatehouse library (local copy)
│   ├── registry/
│   │   └── new-york/
│   │       ├── lib/gatehouse/   # Registry source for Gatehouse
│   │       ├── ui/              # UI primitives (button, card, etc.)
│   │       └── blocks/          # Complex components
│   └── routes/
│       └── index.tsx            # Demo page
├── registry.json                # Registry definition
├── Dockerfile                   # For Coolify/Dokploy
└── package.json
```

## Credits

- [Gatehouse-TS](https://github.com/9Morello/gatehouse-ts) by [9Morello](https://github.com/9Morello) - Authorization library
- [Gatehouse (Rust)](https://github.com/thepartly/gatehouse/) by [Hardbyte](https://hardbyte.nz/) and [Partly](https://partly.com/) - Original implementation
- [shadcn-solid-registry-template](https://github.com/kodehort/shadcn-solid-registry-template) - SolidJS registry template

## License

MIT
