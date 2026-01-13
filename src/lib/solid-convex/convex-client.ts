import { ConvexClient } from "convex/browser";
import { getPublicEnv } from "./server";

let convexClientInstance: ConvexClient | null = null;
let initPromise: Promise<ConvexClient> | null = null;
let authSetup = false;

/**
 * Initialize the Convex client with runtime configuration.
 * This fetches the CONVEX_URL from the server at runtime, allowing for
 * proper containerization where env vars are set when the container starts.
 */
export const initConvex = async (): Promise<ConvexClient> => {
  if (convexClientInstance) {
    return convexClientInstance;
  }

  // If initialization is already in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const { CONVEX_URL } = await getPublicEnv();

    if (!CONVEX_URL) {
      throw new Error(
        "CONVEX_URL is not configured. Please set the CONVEX_URL environment variable in your container/server."
      );
    }

    convexClientInstance = new ConvexClient(CONVEX_URL);

    return convexClientInstance;
  })();

  return initPromise;
};

// Export getter function to ensure client is initialized
// This will lazily initialize the client if it hasn't been initialized yet
export function getConvexClient(): ConvexClient {
  if (!convexClientInstance) {
    throw new Error(
      "Convex client not initialized. Call initConvex() first or ensure CONVEX_URL is set."
    );
  }
  return convexClientInstance;
}

// Optional: Setup function for auth
export function setupConvexAuth(
  fetchToken: (opts: { forceRefreshToken: boolean }) => Promise<string | null>
) {
  if (!convexClientInstance) {
    throw new Error("Convex client not initialized. Call initConvex() first.");
  }
  authSetup = true;
  convexClientInstance.setAuth(fetchToken);
}
