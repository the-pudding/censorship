import { readFileSync } from "fs";
import path from "path";
import adapterStatic from "@sveltejs/adapter-static";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import { timeFormat } from "d3";

const { version, subdirectory } = JSON.parse(readFileSync("package.json", "utf8"));
const dev = process.env.NODE_ENV === "development";
const dir = subdirectory || "";
const prefix = dir.startsWith("/") ? "" : "/";
const base = dev || !dir ? "" : `${prefix}${dir}`;
const timestamp = timeFormat("%Y-%m-%d-%H:%M")(new Date());

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapterStatic(),
		prerender: { default: true },
		files: { lib: "./src" },
		trailingSlash: "always",
		vite: {
			define: {
				__VERSION__: JSON.stringify(version),
				__TIMESTAMP__: JSON.stringify(timestamp)
			},
			resolve: {
				alias: {
					"$actions": path.resolve("./src/actions"),
					"$components": path.resolve("./src/components"),
					"$data": path.resolve("./src/data"),
					"$stores": path.resolve("./src/stores"),
					"$styles": path.resolve("./src/styles"),
					"$svg": path.resolve("./src/svg"),
					"$utils": path.resolve("./src/utils")
				}
			},
			plugins: [
				dsv(),
				svg()
			]
		},
		paths: {
			base
		},
	}
};

export default config;