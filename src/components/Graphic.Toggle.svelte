<script>
  import { getContext } from "svelte";
  import Video from "$components/Video.svelte";
  import ButtonSet from "$components/helpers/ButtonSet.svelte";

  export let clips;

  const data = getContext("data");

  const legend = "Examples:";
  const legendPosition = "left";

  const options = clips.map((value) => {
    const match = data.find((d) => d.id === value);
    const label = `S${match.season} E${match.episode}`;
    return { label, value };
  });

  let censored = true;
  let name = clips[0];

  $: datum = data.find((d) => d.id === name);
  $: start = datum.start;
  $: stop = datum.stop;
</script>

<div class="wrapper">
  {#if clips.length > 1}
    <div class="buttonset">
      <ButtonSet {options} {legend} {legendPosition} bind:value={name} />
    </div>
  {/if}
  {#key name}
    <Video {name} {start} {stop} toggle={true} bind:censored />
  {/key}
</div>

<style>
  .wrapper {
    padding-bottom: 3.25rem;
    max-width: var(--col-width);
    margin: 0 auto;
    /* TODO dynamic */
    min-height: 360px;
  }

  .buttonset {
    margin-bottom: 1rem;
  }
</style>
