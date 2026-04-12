import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/trpc/router";

/**
 * @backend-specialist: tRPC v11 uses createTRPCContext (not createTRPCReact).
 * Returns { TRPCProvider, useTRPC } — hook-based API.
 */

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
