import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Default to node — jsdom v29 is incompatible with Node ≤20.11
    // Component tests that need a browser env can opt in with @vitest-environment jsdom
    environment: "node",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/server/trpc/routers/**", "src/lib/**", "src/stores/**"],
    },
  },
});
