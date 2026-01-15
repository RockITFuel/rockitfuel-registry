import { useSearchParams } from "@solidjs/router";
import type { Accessor } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import type { ZodObject, ZodRawShape } from "zod";
import z from "zod";

/**
 * Infers the output type from a Zod object schema.
 * @template T - The Zod object schema type
 */
type InferOutput<T extends ZodObject<ZodRawShape>> = z.output<T>;

/**
 * A setter function that accepts either a direct value or an updater function.
 * @template T - The type of value being set
 */
type SetterFn<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Converts URL search params to an object, filtering only schema fields and converting types.
 *
 * This function processes search parameters from the URL and converts them to the types
 * expected by the Zod schema. It handles:
 * - Numbers: parses string to number
 * - Booleans: parses "true"/"false" strings
 * - Arrays: handles comma-separated or multiple values
 * - Filters out params not in schema
 *
 * @template T - The Zod object schema type
 * @param schema - The Zod schema to validate against
 * @param searchParams - The raw search parameters from the URL
 * @returns A partial object matching the schema's output type, containing only the parsed values
 *
 * @example
 * ```ts
 * const schema = z.object({ page: z.number(), active: z.boolean() });
 * const params = parseSearchParams(schema, { page: "1", active: "true" });
 * // Returns: { page: 1, active: true }
 * ```
 */
function parseSearchParams<T extends ZodObject<ZodRawShape>>(
  schema: T,
  searchParams: Record<string, string | string[] | undefined>
): Partial<InferOutput<T>> {
  const shape = schema.shape;
  const result: Record<string, unknown> = {};

  for (const key in shape) {
    if (!(key in shape)) continue;

    const value = searchParams[key];
    if (value === undefined || value === null) continue;

    const fieldSchema = shape[key] as z.ZodTypeAny;

    // Handle arrays (multiple values or comma-separated)
    if (Array.isArray(value)) {
      // Check if schema expects an array
      if (fieldSchema instanceof z.ZodArray) {
        result[key] = value;
      } else {
        // Take first value if not array schema
        result[key] = convertValue(value[0] as string, fieldSchema);
      }
    } else if (typeof value === "string") {
      // Handle comma-separated strings that might be arrays
      if (fieldSchema instanceof z.ZodArray && value.includes(",")) {
        result[key] = value.split(",").filter(Boolean);
      } else {
        result[key] = convertValue(value, fieldSchema);
      }
    }
  }

  return result as Partial<InferOutput<T>>;
}

/**
 * Converts a string value to the appropriate type based on Zod schema.
 *
 * This function recursively unwraps optional, nullable, and default schemas to find
 * the underlying type, then converts the string value accordingly:
 * - Numbers: converts string to number (returns original if NaN)
 * - Booleans: converts "true" or "1" to true, everything else to false
 * - Arrays: splits comma-separated strings or wraps single values
 * - Enums: returns the string value as-is
 * - Strings: returns the value as-is
 *
 * @param value - The string value to convert
 * @param schema - The Zod schema type to convert to
 * @returns The converted value matching the schema type, or the original string if conversion fails
 *
 * @example
 * ```ts
 * convertValue("123", z.number()) // Returns: 123
 * convertValue("true", z.boolean()) // Returns: true
 * convertValue("a,b,c", z.array(z.string())) // Returns: ["a", "b", "c"]
 * ```
 */
function convertValue(value: string, schema: z.ZodTypeAny): unknown {
  // Handle optional/nullable schemas
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const innerType = (
      schema as z.ZodOptional<z.ZodTypeAny> | z.ZodNullable<z.ZodTypeAny>
    ).def.innerType as z.ZodTypeAny;
    return convertValue(value, innerType);
  }

  // Handle default values
  if (schema instanceof z.ZodDefault) {
    const innerType = (schema as z.ZodDefault<z.ZodTypeAny>)._def
      .innerType as z.ZodTypeAny;
    return convertValue(value, innerType);
  }

  // Handle number
  if (schema instanceof z.ZodNumber) {
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
  }

  // Handle boolean
  if (schema instanceof z.ZodBoolean) {
    return value === "true" || value === "1";
  }

  // Handle array
  if (schema instanceof z.ZodArray) {
    if (value.includes(",")) {
      return value.split(",").filter(Boolean);
    }
    return [value];
  }

  // Handle enum
  if (schema instanceof z.ZodEnum) {
    return value;
  }

  // Handle string or other types
  return value;
}

/**
 * A SolidJS hook that manages URL search parameters with Zod validation.
 *
 * This hook synchronizes URL search parameters with a validated state object. It:
 * - Parses search params from the URL and validates them against a Zod schema
 * - Provides reactive access to the validated data
 * - Allows updating search params with automatic URL synchronization
 * - Handles type conversion (strings to numbers, booleans, arrays, etc.)
 * - Falls back to default values when validation fails
 * - **Validates all set operations**: Invalid values are rejected and search params are not updated
 *
 * @template T - The Zod object schema type
 * @param props - Configuration object
 * @param props.schema - The Zod schema to validate search params against
 * @param props.defaultValue - Default values used when params are missing or invalid
 * @returns A tuple containing:
 *   - An accessor function that returns the current validated data
 *   - A setter function to update search params (accepts partial updates). If validation fails,
 *     the update is silently rejected and search params remain unchanged (error is logged to console)
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   page: z.number().default(1),
 *   search: z.string().optional(),
 *   tags: z.array(z.string()).default([])
 * });
 *
 * const [params, setParams] = useValidatedSearchParams({
 *   schema,
 *   defaultValue: { page: 1, tags: [] }
 * });
 *
 * // Read: params().page, params().search
 * // Update: setParams({ page: 2 }) or setParams(prev => ({ ...prev, page: prev.page + 1 }))
 * // Invalid update (e.g., setParams({ page: "invalid" })) will be rejected silently
 * ```
 */
export function useValidatedSearchParams<
  T extends ZodObject<ZodRawShape>,
>(props: {
  schema: T;
  defaultValue: InferOutput<T>;
}): [Accessor<InferOutput<T>>, SetterFn<Partial<InferOutput<T>>>] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = createSignal(props.defaultValue);

  // Reactively parse searchParams when URL changes
  createEffect(() => {
    try {
      // Parse and filter search params to only include schema fields
      const parsed = parseSearchParams(props.schema, searchParams);

      // Merge with defaultValue to ensure all required fields are present
      const merged = { ...props.defaultValue, ...parsed };

      // Validate against schema
      const validated = props.schema.parse(merged) as InferOutput<T>;
      setData(() => validated);
    } catch (e) {
      console.error("Failed to parse search params:", e);
      setData(() => props.defaultValue);
    }
  });

  const set: SetterFn<Partial<InferOutput<T>>> = (value) => {
    try {
      // Get current validated data
      const current = data();

      // Handle function form of setter or direct value
      const updateValue = typeof value === "function" ? value(current) : value;

      // Merge with current values (partial update)
      const merged = { ...current, ...updateValue };

      // Validate the merged value
      const validated = props.schema.parse(merged) as InferOutput<T>;

      // Convert to URL-safe format (strings, numbers, booleans, arrays)
      const urlParams: Record<
        string,
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | null
        | undefined
      > = {};
      for (const [key, val] of Object.entries(validated)) {
        if (val === undefined) continue;
        if (val === null) {
          urlParams[key] = null;
        } else if (Array.isArray(val)) {
          urlParams[key] = val as string[] | number[] | boolean[];
        } else if (
          typeof val === "string" ||
          typeof val === "number" ||
          typeof val === "boolean"
        ) {
          urlParams[key] = val;
        }
      }

      // Update search params (SolidJS router merges by default)
      setSearchParams(urlParams);
    } catch (e) {
      console.error("Failed to set search params:", e);
    }
  };

  return [data, set];
}
