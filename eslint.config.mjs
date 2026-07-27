import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "app/generated/**",
    "node_modules/**",
    "screenshots/**",
    "storage/**",
    "work/**",
    ".agent-*/**",
  ]),
]);
