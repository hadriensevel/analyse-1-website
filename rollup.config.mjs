import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

export default [
	{
		input: [
			"js/main.js",
			"js/main-semestre.js",
			"js/main-content.js",
			"js/questions/all-questions-page.js",
			"js/questions/my-questions-page.js",
			"js/questions/general-questions-page.js",
			"js/utils/latex-preview.js",
		],
		output: {
			dir: "dist/js",
			format: "es",
			//sourcemap: true
		},
		plugins: [
			resolve({ browser: true }),
			terser({ format: { comments: false } }),
		],
	},
	{
		input: "js/bundle.js",
		output: {
			// file: "dist/js/bundle.js",
      dir: "dist/js/",
			format: "es",
			//sourcemap: true
		},
		plugins: [
			resolve({ browser: true }),
			terser({ format: { comments: false } }),
		],
	},
	{
		input: "js/bundle2.js",
		output: {
			// file: "dist/js/bundle2.js",
      dir: "dist/js/",
			format: "es",
			//sourcemap: true
		},
		plugins: [
			resolve({ browser: true }),
			terser({ format: { comments: false } }),
		],
	},
];
