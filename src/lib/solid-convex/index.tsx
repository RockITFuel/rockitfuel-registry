/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import { ReactiveMap } from "@solid-primitives/map";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import { getFunctionName } from "convex/server";
import { convexToJson } from "convex/values";
import { createEffect, createMemo, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

import { getConvexClient, initConvex } from "./convex-client";

/**
 * Extract a user-friendly error message from a Convex error.
 * Convex errors often contain technical details like stack traces and request IDs.
 * This function extracts just the human-readable message.
 *
 * @example
 * // Input: "Uncaught Error: Gebruiker is al lid van dit team at handler (./convex/teams.ts:558:11)"
 * // Output: "Gebruiker is al lid van dit team"
 */
export function getUserErrorMessage(error: Error, fallback?: string): string {
  const defaultMessage = fallback ?? "Er is een onverwachte fout opgetreden";

  if (!error.message) {
    return defaultMessage;
  }

  // Try to extract the actual error message, removing technical prefixes and stack traces
  // Pattern handles: "Uncaught Error: <message> at handler (...)" or just "<message> at handler (...)"
  const match = error.message.match(
    /(?:Uncaught\s+)?(?:Error:\s*)?(.+?)(?:\s+at\s+|$)/i
  );
  if (match?.[1]) {
    const extracted = match[1].trim();
    // Make sure we got something meaningful
    if (extracted.length > 0) {
      return extracted;
    }
  }

  return defaultMessage;
}

export type ConvexError = Error & { userMessage: string };

interface CacheEntry<T = unknown> {
  data: T;
  source: "ssr-prefetch" | "csr-prefetch" | "csr-optimistic" | "subscription";
  timestamp: number;
}

export const convexCacheMap = new ReactiveMap<string, CacheEntry>();
const inflightRequests = new Map<string, Promise<any>>();

type QueryArgsSource<Query extends FunctionReference<"query">> =
  | (() => FunctionArgs<Query>)
  | FunctionArgs<Query>
  | undefined;

type OptimisticUpdate<
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query">,
> = {
  query: Query;
  args?: QueryArgsSource<Query>;
  apply: (
    currentData: FunctionReturnType<Query> | undefined,
    mutationArgs: FunctionArgs<Mutation>
  ) => FunctionReturnType<Query> | undefined;
  rollbackOnError?: boolean;
};

export function convexQueryKey(
  queryKey: [
    FunctionReference<"query">,
    Record<string, any>,
    NonNullable<unknown>,
  ]
): string {
  return `${getFunctionName(queryKey[0])}|${JSON.stringify(convexToJson(queryKey[1]))}`;
}

/**
 * @example
 * export const route = {
  load: async () => {
    await prefetchConvex(api.todo.getAll);
  },
} satisfies RouteDefinition;

export default function Todo() {
  const todos = createQuery(api.todo.getAll);
  return (
    <div>
      <h1>Todos</h1>
      <ul>
        <For each={todos()}>{(todo) => <li>{todo.title}</li>}</For>
      </ul>
    </div>
  );
 * @param query
 * @param args
 * @returns
 */
export const prefetchConvex = async <Query extends FunctionReference<"query">>(
  query: Query,
  args?: FunctionArgs<Query>
): Promise<FunctionReturnType<Query> | undefined> => {
  const key = convexQueryKey([query, args ? args : {}, {}]);

  // Return existing in-flight request to prevent duplicates
  const inflight = inflightRequests.get(key);
  if (inflight) {
    return inflight;
  }

  // Return cached data if available
  const cached = convexCacheMap.get(key);
  if (cached) {
    return cached.data as FunctionReturnType<Query>;
  }

  // Fetch fresh data
  const promise = (async () => {
    if (isServer) {
      try {
        const { createConvexHttpClient } = await import(
          "../auth/start-handlers"
        );
        const serverClient = createConvexHttpClient();
        const data = await serverClient.query(query, args ? args : {});
        if (data !== undefined) {
          convexCacheMap.set(key, {
            data,
            source: "ssr-prefetch",
            timestamp: Date.now(),
          });
        }
        return data;
      } catch (error) {
        return;
      }
    } else {
      await initConvex();
      const httpClient = getConvexClient();
      const data = await httpClient?.query(query, args ? args : {});
      if (data !== undefined) {
        convexCacheMap.set(key, {
          data,
          source: "csr-prefetch",
          timestamp: Date.now(),
        });
      }
      return data;
    }
  })().finally(() => inflightRequests.delete(key));

  inflightRequests.set(key, promise);
  return promise;
};

export async function prefetchConvexBatch(
  queries: Array<{
    query: FunctionReference<"query">;
    args?: Record<string, any>;
  }>
): Promise<void> {
  await Promise.allSettled(
    queries.map(({ query, args }) => prefetchConvex(query, args))
  );
}

export function clearConvexCache() {
  convexCacheMap.clear();
  inflightRequests.clear();
}

// Create a reactive SolidJS atom attached to a Convex query function.
export function createQuery<Query extends FunctionReference<"query">>(
  query: Query,
  options?: {
    args?: () => FunctionArgs<Query>; // args accepts an accessor instead of plain object for reactivity changes
    onSuccess?: (result: FunctionReturnType<Query>) => void;
    onError?: (error: Error) => void;
    debug?: boolean;
    /**
     * Whether the query should be enabled. Can be a boolean or a function that returns a boolean.
     * When disabled, the subscription will not be set up and args will not be evaluated.
     * @default true
     */
    enabled?: boolean | (() => boolean);
  }
): () => FunctionReturnType<Query> | undefined {
  // Helper to check if query is enabled
  const isEnabled = () =>
    typeof options?.enabled === "function"
      ? options.enabled()
      : (options?.enabled ?? true);

  // Derive value directly from cache - automatically updates on optimistic updates and subscription changes
  const value = createMemo(() => {
    // Don't evaluate args if disabled
    if (!isEnabled()) {
      return;
    }
    const key = convexQueryKey([
      query,
      options?.args ? options.args() : {},
      {},
    ]);
    const cached = convexCacheMap.get(key);
    return cached?.data as FunctionReturnType<Query> | undefined;
  });

  createEffect(() => {
    // Don't evaluate args if disabled or debug is off
    if (!(options?.debug && isEnabled())) {
      return;
    }
    const fullArgs = options?.args ? options.args() : {};
    const currentKey = convexQueryKey([query, fullArgs, {}]);
    const cached = convexCacheMap.get(currentKey);
    console.log(`Debug ${currentKey}: `, JSON.stringify(cached, null, 2));
  });

  // Set up Convex subscription
  createEffect(() => {
    // Check enabled first before evaluating args
    if (!isEnabled()) {
      return;
    }

    const fullArgs = options?.args ? options.args() : {};
    const currentKey = convexQueryKey([query, fullArgs, {}]);
    let unsubber: (() => void) | undefined;

    // Initialize client asynchronously, then set up subscription
    initConvex()
      .then(() => {
        unsubber = getConvexClient().onUpdate(
          query,
          fullArgs as FunctionArgs<Query>,
          (result) => {
            console.log("on convex subscription update");
            // Update cache with subscription data
            convexCacheMap.set(currentKey, {
              data: result,
              source: "subscription",
              timestamp: Date.now(),
            });

            options?.onSuccess?.(result);
          },
          (error) => {
            options?.onError?.(error);
          }
        );
      })
      .catch((error) => {
        options?.onError?.(error);
      });

    // Cleanup subscription when args change or effect re-runs
    onCleanup(() => {
      if (unsubber) {
        unsubber();
      }
    });
  });

  return value;
}

/**
 * Create a Convex mutation accessor with optional optimistic updates.
 *
 * ### When to use `produce`
 * - Stores or deeply nested objects: wrap `apply` logic in Solid's `produce` for ergonomic drafts.
 * - Signals containing nested objects: consider `produce` only if manual cloning is noisy.
 * - Primitive values: return the new primitive directly to avoid extra work.
 *
 * @example
 * const createTodo = createMutation(api.todos.createTodo, {
 *   optimistic: {
 *     query: api.todos.getAllTodos,
 *     apply: (todos = [], args) => [
 *       { _id: `temp-${Date.now()}`, title: args.title, completed: false },
 *       ...todos,
 *     ]
 *   }
 * })
 */
export function createMutation<
  Mutation extends FunctionReference<"mutation">,
  Query extends FunctionReference<"query"> = FunctionReference<"query">,
>(
  mutation: Mutation,
  options?: {
    onSuccess?: (result: FunctionReturnType<Mutation>) => void;
    onError?: (error: ConvexError) => void;
    /**
     * Configure optimistic updates by describing which cached queries should be patched
     * before the server responds. Use Solid's `produce` helper yourself when mutating
     * nested structures, and prefer direct immutable replacements for primitives.
     */
    optimistic?:
      | OptimisticUpdate<Mutation, Query>
      | OptimisticUpdate<Mutation, Query>[];
    /**
     * Debounce delay in milliseconds. When set, the mutation will only execute
     * after the specified delay has passed without any new calls.
     * @default 0 (no debounce)
     */
    debounce?: number;
  }
): (args?: FunctionArgs<Mutation>) => Promise<FunctionReturnType<Mutation>> {
  const debounceMs = options?.debounce ?? 0;
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: ((value: FunctionReturnType<Mutation>) => void) | null =
    null;
  let pendingReject: ((error: Error) => void) | null = null;
  const normalizeArgs = <Q extends FunctionReference<"query">>(
    argsSource: QueryArgsSource<Q>
  ): FunctionArgs<Q> => {
    if (typeof argsSource === "function") {
      return (argsSource as () => FunctionArgs<Q>)();
    }
    return (argsSource ?? ({} as FunctionArgs<Q>)) as FunctionArgs<Q>;
  };

  const normalizeOptimistic = (
    optimistic?:
      | OptimisticUpdate<Mutation, Query>
      | OptimisticUpdate<Mutation, Query>[]
  ): OptimisticUpdate<Mutation, Query>[] => {
    if (!optimistic) {
      return [];
    }
    return Array.isArray(optimistic) ? optimistic : [optimistic];
  };

  const optimisticEntries = normalizeOptimistic(options?.optimistic);

  // Track optimistic updates for potential rollback on error
  let appliedOptimisticEntries: Array<{
    key: string;
    previous?: CacheEntry;
    shouldRollback: boolean;
  }> = [];

  const applyOptimisticUpdate = (
    optimistic: OptimisticUpdate<Mutation, Query>,
    fullArgs: FunctionArgs<Mutation>
  ) => {
    const resolvedArgs = normalizeArgs(optimistic.args);
    const cacheKey = convexQueryKey([
      optimistic.query,
      resolvedArgs as Record<string, any>,
      {},
    ]);

    const existingEntry = convexCacheMap.get(cacheKey) as
      | CacheEntry<FunctionReturnType<Query>>
      | undefined;

    const nextData = optimistic.apply(existingEntry?.data, fullArgs);
    if (nextData === undefined) {
      return;
    }

    // Only store the first previous entry for this key (for proper rollback)
    if (!appliedOptimisticEntries.some((entry) => entry.key === cacheKey)) {
      appliedOptimisticEntries.push({
        key: cacheKey,
        previous: existingEntry,
        shouldRollback: optimistic.rollbackOnError !== false,
      });
    }

    convexCacheMap.set(cacheKey, {
      data: nextData,
      source: "csr-optimistic",
      timestamp: Date.now(),
    });
  };

  const rollbackOptimisticUpdates = () => {
    appliedOptimisticEntries.forEach(({ key, previous, shouldRollback }) => {
      if (!shouldRollback) {
        return;
      }
      if (previous) {
        convexCacheMap.set(key, previous);
        return;
      }
      convexCacheMap.delete(key);
    });
    appliedOptimisticEntries = [];
  };

  const executeNetworkCall = async (
    fullArgs: FunctionArgs<Mutation>
  ): Promise<FunctionReturnType<Mutation>> => {
    await initConvex();

    return getConvexClient()
      .mutation(mutation, fullArgs)
      .then((result) => {
        // Clear tracked optimistic entries on success (subscription will update cache)
        appliedOptimisticEntries = [];
        options?.onSuccess?.(result);
        return result;
      })
      .catch((error: Error) => {
        rollbackOptimisticUpdates();
        const convexError: ConvexError = Object.assign(error, {
          userMessage: getUserErrorMessage(error),
        });
        options?.onError?.(convexError);
        throw error;
      });
  };

  return (args) => {
    const fullArgs = args ?? ({} as FunctionArgs<Mutation>);

    // Apply optimistic updates immediately
    for (const optimistic of optimisticEntries) {
      applyOptimisticUpdate(optimistic, fullArgs);
    }

    // No debounce - execute network call immediately
    if (debounceMs <= 0) {
      return executeNetworkCall(fullArgs);
    }

    // Clear any pending debounced call
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Return a promise that will resolve when the debounced network call executes
    return new Promise<FunctionReturnType<Mutation>>((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;

      debounceTimeout = setTimeout(() => {
        debounceTimeout = null;
        executeNetworkCall(fullArgs)
          .then((result) => {
            pendingResolve?.(result);
            pendingResolve = null;
            pendingReject = null;
          })
          .catch((error) => {
            pendingReject?.(error);
            pendingResolve = null;
            pendingReject = null;
          });
      }, debounceMs);
    });
  };
}

export function createAction<Action extends FunctionReference<"action">>(
  action: Action,
  options?: {
    onSuccess?: (result: FunctionReturnType<Action>) => void;
    onError?: (error: ConvexError) => void;
  }
): (args?: FunctionArgs<Action>) => Promise<FunctionReturnType<Action>> {
  return async (args) => {
    await initConvex();
    const fullArgs = args ?? ({} as FunctionArgs<Action>);
    return getConvexClient()
      .action(action, fullArgs)
      .then((result) => {
        options?.onSuccess?.(result);
        return Promise.resolve(result);
      })
      .catch((error: Error) => {
        const convexError: ConvexError = Object.assign(error, {
          userMessage: getUserErrorMessage(error),
        });
        options?.onError?.(convexError);
        return Promise.reject(error);
      });
  };
}
