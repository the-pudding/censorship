<script>
  import { setContext } from "svelte";
  import { browser } from "$app/env";
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.svelte";
  import copy from "$data/copy.json";
  import version from "$utils/version.js";

  version();

  const preloadFont = [];

  const { title, description, url, keywords } = copy;
  setContext("copy", copy);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<App />
