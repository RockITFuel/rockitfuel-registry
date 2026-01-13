/**
 * Server function to get public environment variables at runtime.
 * This is called from the client to fetch env vars after the container starts,
 * allowing for runtime configuration instead of build-time.
 *
 * Note: We access process.env directly here instead of using serverEnv
 * to avoid circular dependency issues during server function extraction.
 */
export const getPublicEnv = (): Promise<{
  CONVEX_URL: string;
}> => {
  "use server";

  const convexUrl = process.env.CONVEX_URL;

  if (!convexUrl) {
    throw new Error(
      "CONVEX_URL environment variable is not set. Please configure it in your deployment environment."
    );
  }

  return Promise.resolve({
    CONVEX_URL: convexUrl,
  });
};
