/**
 * Demo Policies for Gatehouse Authorization Library
 * 
 * This file demonstrates how to set up RBAC, ABAC, and ReBAC policies
 * using the Gatehouse-TS authorization library.
 */

import {
  buildRbacPolicy,
  buildAbacPolicy,
  buildRebacPolicy,
  buildOrPolicy,
  buildAndPolicy,
  PermissionChecker,
} from "@/lib/gatehouse";

// ============================================================================
// Type Definitions
// ============================================================================

export type User = {
  id: number;
  name: string;
  roles: string[];
  department: string;
};

export type Document = {
  id: number;
  title: string;
  ownerId: number;
  isPublic: boolean;
  requiredDepartment: string | null;
};

export type Action = "read" | "write" | "delete";

export type Context = {
  timestamp: Date;
  ipAddress?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

export const sampleUsers: User[] = [
  { id: 1, name: "Alice (Admin)", roles: ["admin"], department: "Engineering" },
  { id: 2, name: "Bob (Editor)", roles: ["editor"], department: "Marketing" },
  { id: 3, name: "Charlie (Viewer)", roles: ["viewer"], department: "Sales" },
  { id: 4, name: "Diana (Engineer)", roles: ["viewer"], department: "Engineering" },
];

export const sampleDocuments: Document[] = [
  { 
    id: 101, 
    title: "Public Announcement", 
    ownerId: 1, 
    isPublic: true, 
    requiredDepartment: null 
  },
  { 
    id: 102, 
    title: "Engineering Specs", 
    ownerId: 1, 
    isPublic: false, 
    requiredDepartment: "Engineering" 
  },
  { 
    id: 103, 
    title: "Bob's Draft", 
    ownerId: 2, 
    isPublic: false, 
    requiredDepartment: null 
  },
  { 
    id: 104, 
    title: "Marketing Strategy", 
    ownerId: 2, 
    isPublic: false, 
    requiredDepartment: "Marketing" 
  },
];

// ============================================================================
// Individual Policies
// ============================================================================

/**
 * RBAC Policy - Role-Based Access Control
 * 
 * Grants access based on user roles:
 * - read: viewer, editor, admin
 * - write: editor, admin
 * - delete: admin only
 */
export const rbacPolicy = buildRbacPolicy<User, Document, Action, Context, string>({
  name: "RBAC Policy",
  requiredRolesResolver: (_resource, action) => {
    switch (action) {
      case "read":
        return ["viewer", "editor", "admin"];
      case "write":
        return ["editor", "admin"];
      case "delete":
        return ["admin"];
      default:
        return [];
    }
  },
  userRolesResolver: (user) => user.roles,
});

/**
 * ABAC Policy - Attribute-Based Access Control (Public Documents)
 * 
 * Grants read access to any public document, regardless of user roles.
 */
export const publicDocPolicy = buildAbacPolicy<User, Document, Action, Context>({
  name: "Public Document Policy",
  condition: ({ resource, action }) => resource.isPublic && action === "read",
});

/**
 * ABAC Policy - Department-Based Access
 * 
 * Grants access when the user's department matches the document's required department.
 */
export const departmentPolicy = buildAbacPolicy<User, Document, Action, Context>({
  name: "Department Policy",
  condition: ({ subject, resource }) => 
    resource.requiredDepartment !== null && 
    subject.department === resource.requiredDepartment,
});

/**
 * ReBAC Policy - Relationship-Based Access Control (Ownership)
 * 
 * Grants full access when the user owns the document.
 */
export const ownerPolicy = buildRebacPolicy<User, Document, Action, Context>({
  name: "Owner Policy",
  relationship: "owner",
  resolver: ({ subject, resource }) => subject.id === resource.ownerId,
});

// ============================================================================
// Combined Policies
// ============================================================================

/**
 * Combined OR Policy
 * 
 * Grants access if ANY of these conditions are met:
 * 1. User is the document owner (ReBAC)
 * 2. Document is public and action is read (ABAC)
 * 3. User has the required role (RBAC)
 */
export const combinedOrPolicy = buildOrPolicy<User, Document, Action, Context>({
  name: "Combined Access Policy (OR)",
  policies: [ownerPolicy, publicDocPolicy, rbacPolicy],
});

/**
 * Strict AND Policy
 * 
 * Requires BOTH conditions:
 * 1. User must have correct role (RBAC)
 * 2. User must be in the correct department (ABAC)
 */
export const strictAndPolicy = buildAndPolicy<User, Document, Action, Context>({
  name: "Strict Access Policy (AND)",
  policies: [rbacPolicy, departmentPolicy],
});

// ============================================================================
// Permission Checker Factory
// ============================================================================

export type PolicyMode = "combined" | "rbac" | "abac" | "rebac" | "strict";

/**
 * Creates a PermissionChecker configured with the specified policy mode.
 * 
 * @param mode - The policy configuration to use
 * @returns A configured PermissionChecker instance
 */
export function createPermissionChecker(mode: PolicyMode = "combined") {
  const checker = new PermissionChecker<User, Document, Action, Context>();

  switch (mode) {
    case "rbac":
      checker.addPolicy(rbacPolicy);
      break;
    case "abac":
      checker.addPolicy(publicDocPolicy);
      checker.addPolicy(departmentPolicy);
      break;
    case "rebac":
      checker.addPolicy(ownerPolicy);
      break;
    case "strict":
      checker.addPolicy(strictAndPolicy);
      break;
    case "combined":
    default:
      checker.addPolicy(combinedOrPolicy);
      break;
  }

  return checker;
}

/**
 * Get human-readable description of a policy mode
 */
export function getPolicyDescription(mode: PolicyMode): string {
  switch (mode) {
    case "rbac":
      return "Role-based only: Access based on user roles (viewer/editor/admin)";
    case "abac":
      return "Attribute-based only: Access based on document and user attributes";
    case "rebac":
      return "Relationship-based only: Access only for document owners";
    case "strict":
      return "Strict AND: Requires both correct role AND matching department";
    case "combined":
    default:
      return "Combined OR: Grants access if owner OR public OR has role";
  }
}
