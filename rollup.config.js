import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { babel, getBabelOutputPlugin } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import eslint from "@rollup/plugin-eslint";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/cjs/index.js",
				format: "cjs",
				sourcemap: true,
				plugins: [
					getBabelOutputPlugin({
						presets: [
							["@babel/preset-react", { runtime: "automatic" }],
						],
					}),
				],
			},
			{
				file: "dist/esm/index.js",
				format: "esm",
				sourcemap: true,
				plugins: [
					getBabelOutputPlugin({
						presets: [
							["@babel/preset-react", { runtime: "automatic" }],
						],
					}),
				],
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({ tsconfig: "./tsconfig.json" }),
			babel({
				presets: [["@babel/preset-react", { runtime: "automatic" }]],
			}),
			eslint({
				overrideConfig: {
					// parser: "@babel/eslint-parser",
					parser: "@typescript-eslint/parser",
					plugins: ["@typescript-eslint", "react-hooks"],
					extends: [
						"eslint:recommended",
						"plugin:@typescript-eslint/eslint-recommended",
						"plugin:@typescript-eslint/recommended",
					],
					env: {
						es6: true,
					},
					parserOptions: {
						sourceType: "module",
					},

					rules: {
						"@typescript-eslint/no-explicit-any": ["off"],
						"react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
						// "react-hooks/exhaustive-deps": "warn"
						"react-hooks/exhaustive-deps": [
							"warn",
							{
								additionalHooks: "(useDebouncedEffect)",
							},
						],
					},
				},
				// overrideConfig: {
				// plugins: ["react-hooks"],
				// rules: {
				// 	"react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
				// 	// "react-hooks/exhaustive-deps": "warn"
				// 	"react-hooks/exhaustive-deps": [
				// 		"warn",
				// 		{
				// 			additionalHooks: "(useDebouncedEffect)",
				// 		},
				// 	],
				// },
				// },
			}),
		],
		external: ["react", "lodash"],
	},
	{
		input: "dist/esm/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "esm" }],
		plugins: [dts()],
	},
];
