"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { TRPCProvider as TRPCContextProvider } from "./client";
import type { AppRouter } from "@/server/trpc/router";

/**
 * @frontend-specialist: Wraps TanStack Query + tRPC v11 providers.
 * tRPC v11 uses `trpcClient` prop (not `links`).
 * QueryClient created lazily in useState to avoid SSR issues.
 */

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContextProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCContextProvider>
    </QueryClientProvider>
  );
}
