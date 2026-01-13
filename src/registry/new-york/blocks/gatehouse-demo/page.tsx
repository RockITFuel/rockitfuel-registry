/**
 * Gatehouse Authorization Demo
 *
 * Interactive demonstration of RBAC, ABAC, and ReBAC authorization patterns
 * using the Gatehouse-TS library.
 */

import { createSignal, For, Show } from "solid-js";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  type Action,
  createPermissionChecker,
  type Document,
  getPolicyDescription,
  type PolicyMode,
  sampleDocuments,
  sampleUsers,
  type User,
} from "./lib/demo-policies";

export function GatehouseDemo() {
  // State
  const [selectedUser, setSelectedUser] = createSignal<User>(sampleUsers[0]);
  const [selectedDoc, setSelectedDoc] = createSignal<Document>(
    sampleDocuments[0]
  );
  const [selectedAction, setSelectedAction] = createSignal<Action>("read");
  const [policyMode, setPolicyMode] = createSignal<PolicyMode>("combined");
  const [result, setResult] = createSignal<"granted" | "denied" | null>(null);
  const [trace, setTrace] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal(false);

  const actions: Action[] = ["read", "write", "delete"];
  const policyModes: PolicyMode[] = [
    "combined",
    "rbac",
    "abac",
    "rebac",
    "strict",
  ];

  const checkAccess = async () => {
    setIsLoading(true);
    setResult(null);
    setTrace("");

    try {
      const checker = createPermissionChecker(policyMode());
      const evaluation = await checker.evaluateAccess({
        subject: selectedUser(),
        resource: selectedDoc(),
        action: selectedAction(),
        context: { timestamp: new Date() },
      });

      setResult(evaluation.isGranted() ? "granted" : "denied");
      setTrace(evaluation.getDisplayTrace());
    } catch (error) {
      setTrace(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      {/* Header */}
      <div>
        <h2 class="font-bold text-2xl">Gatehouse Authorization Demo</h2>
        <p class="text-muted-foreground">
          Test different authorization patterns: RBAC, ABAC, ReBAC, and combined
          policies
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Select a user, document, action, and policy mode to test
              authorization
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            {/* User Selection */}
            <div class="space-y-2">
              <label class="font-medium text-sm">User (Subject)</label>
              <div class="grid grid-cols-2 gap-2">
                <For each={sampleUsers}>
                  {(user) => (
                    <button
                      class={`rounded-md border p-3 text-left text-sm transition-colors ${
                        selectedUser().id === user.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedUser(user)}
                      type="button"
                    >
                      <div class="font-medium">{user.name}</div>
                      <div class="text-muted-foreground text-xs">
                        Roles: {user.roles.join(", ")}
                      </div>
                      <div class="text-muted-foreground text-xs">
                        Dept: {user.department}
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Document Selection */}
            <div class="space-y-2">
              <label class="font-medium text-sm">Document (Resource)</label>
              <div class="grid grid-cols-2 gap-2">
                <For each={sampleDocuments}>
                  {(doc) => (
                    <button
                      class={`rounded-md border p-3 text-left text-sm transition-colors ${
                        selectedDoc().id === doc.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                      type="button"
                    >
                      <div class="font-medium">{doc.title}</div>
                      <div class="text-muted-foreground text-xs">
                        Owner: User #{doc.ownerId} |{" "}
                        {doc.isPublic ? "Public" : "Private"}
                      </div>
                      <Show when={doc.requiredDepartment}>
                        <div class="text-muted-foreground text-xs">
                          Dept: {doc.requiredDepartment}
                        </div>
                      </Show>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Action Selection */}
            <div class="space-y-2">
              <label class="font-medium text-sm">Action</label>
              <div class="flex gap-2">
                <For each={actions}>
                  {(action) => (
                    <Button
                      onClick={() => setSelectedAction(action)}
                      size="sm"
                      variant={
                        selectedAction() === action ? "default" : "outline"
                      }
                    >
                      {action}
                    </Button>
                  )}
                </For>
              </div>
            </div>

            {/* Policy Mode Selection */}
            <div class="space-y-2">
              <label class="font-medium text-sm">Policy Mode</label>
              <div class="flex flex-wrap gap-2">
                <For each={policyModes}>
                  {(mode) => (
                    <Button
                      onClick={() => setPolicyMode(mode)}
                      size="sm"
                      variant={policyMode() === mode ? "default" : "outline"}
                    >
                      {mode.toUpperCase()}
                    </Button>
                  )}
                </For>
              </div>
              <p class="text-muted-foreground text-xs">
                {getPolicyDescription(policyMode())}
              </p>
            </div>

            {/* Check Access Button */}
            <Button class="w-full" disabled={isLoading()} onClick={checkAccess}>
              {isLoading() ? "Checking..." : "Check Access"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              Authorization decision and evaluation trace
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {/* Result Badge */}
            <Show when={result()}>
              <div
                class={`rounded-lg p-4 text-center font-bold text-lg ${
                  result() === "granted"
                    ? "bg-green-500/20 text-green-600"
                    : "bg-red-500/20 text-red-600"
                }`}
              >
                {result() === "granted" ? "ACCESS GRANTED" : "ACCESS DENIED"}
              </div>
            </Show>

            {/* Request Summary */}
            <Show when={result()}>
              <div class="rounded-md bg-muted p-3 text-sm">
                <div class="font-medium">Request Summary:</div>
                <div class="mt-1 text-muted-foreground">
                  <span class="font-medium">{selectedUser().name}</span>{" "}
                  attempted to{" "}
                  <span class="font-medium">{selectedAction()}</span>{" "}
                  <span class="font-medium">"{selectedDoc().title}"</span>
                </div>
              </div>
            </Show>

            {/* Evaluation Trace */}
            <Show when={trace()}>
              <div class="space-y-2">
                <div class="font-medium text-sm">Evaluation Trace:</div>
                <pre class="max-h-[300px] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-xs">
                  {trace()}
                </pre>
              </div>
            </Show>

            {/* Placeholder */}
            <Show when={!(result() || trace())}>
              <div class="flex min-h-[200px] items-center justify-center text-muted-foreground">
                Click "Check Access" to see the authorization result
              </div>
            </Show>
          </CardContent>
        </Card>
      </div>

      {/* Policy Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Reference</CardTitle>
          <CardDescription>
            Understanding the different authorization patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div class="space-y-1">
              <h4 class="font-semibold">RBAC (Role-Based)</h4>
              <p class="text-muted-foreground text-sm">
                Access based on user roles. Viewers can read, editors can write,
                admins can delete.
              </p>
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold">ABAC (Attribute-Based)</h4>
              <p class="text-muted-foreground text-sm">
                Access based on attributes like public/private status or
                department matching.
              </p>
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold">ReBAC (Relationship-Based)</h4>
              <p class="text-muted-foreground text-sm">
                Access based on relationships like document ownership.
              </p>
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold">Combined (OR)</h4>
              <p class="text-muted-foreground text-sm">
                Grants access if ANY policy allows (owner OR public OR has
                role).
              </p>
            </div>
            <div class="space-y-1">
              <h4 class="font-semibold">Strict (AND)</h4>
              <p class="text-muted-foreground text-sm">
                Requires ALL conditions: correct role AND matching department.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GatehouseDemo;
