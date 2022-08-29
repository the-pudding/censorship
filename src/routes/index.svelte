<script>
	import { setContext } from "svelte";
	import { browser } from "$app/env";
	import Meta from "$components/Meta.svelte";
	import App from "$components/App.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	export let data;

	version();

	const preloadFont = [
		"https://pudding.cool/assets/fonts/atkinson/atkinson-hyperlegible-v1-latin-400.woff2",
		"https://pudding.cool/assets/fonts/atkinson/atkinson-hyperlegible-v1-latin-700.woff2"
	];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<App />
