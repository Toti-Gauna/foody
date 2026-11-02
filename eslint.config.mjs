import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-*/**",
    ".lab-shots/**",
    "test-results/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/prototipos/**",
  ]),
  {
    // The game engine and games are copied from games-market (docs/procedencia.md), where they run as they are: its
    // refs-in-render and effect patterns are deliberate (a canvas loop reads refs every frame). The React Compiler rules
    // that flag them stay on for everything written in this repo.
    files: ["games/core/**", "games/ui/**", "games/ninja/**", "games/combinaciones/**", "games/catapulta/**", "games/pinturillo/**"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);

export default eslintConfig;
