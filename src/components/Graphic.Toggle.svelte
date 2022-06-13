<script>
  import { getContext } from "svelte";
  import Video from "$components/Video.svelte";

  export let clips;

  const data = getContext("data");

  let censored = true;
  let index = 0;

  $: name = clips[index];
  $: datum = data.find((d) => d.id === name);
  $: start = datum.start;
  $: stop = datum.stop;
</script>

<div>
  <Video {name} {start} {stop} toggle={true} bind:censored />
</div>

<style>
  div {
    padding-bottom: 3.25rem;
  }
</style>
