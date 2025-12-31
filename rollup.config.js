const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const dts = require("rollup-plugin-dts").default;

const input = "src/index.tsx";
const external = ["react", "react-dom"];
const extensions = [".js", ".jsx", ".ts", ".tsx"];

/** @type {import('rollup').RollupOptions[]} */
module.exports = [
  {
    input,
    external,
    output: [
      {
        file: "dist/index.mjs",
        format: "esm",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationDir: undefined,
      }),
    ],
  },
  {
    input,
    external,
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
