import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  {
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  },
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {
    ignores: ["dist/"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node.js globals
        ...globals.jest, // Include Jest globals
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];