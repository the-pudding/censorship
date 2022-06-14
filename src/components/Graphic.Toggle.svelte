<script>
  import { getContext } from "svelte";
  import Video from "$components/Video.svelte";
  import ButtonSet from "$components/helpers/ButtonSet.svelte";

  export let clips;

  let offsetWidth;

  const data = getContext("data");

  const legend = "Examples:";
  const legendPosition = "left";

  const options = clips.map((value, i) => {
    const match = data.find((d) => d.id === value);
    const episode = `S${match.season} E${match.episode}`;
    const label = i + 1;
    return { label, value, episode };
  });

  let censored = true;
  let name = clips[0];

  $: datum = data.find((d) => d.id === name);
  $: start = datum.start;
  $: stop = datum.stop;
  $: minHeight = `${Math.max(200, offsetWidth / (16 / 9))}px`;
</script>

<div class="wrapper" bind:offsetWidth>
  {#if clips.length > 1}
    <div class="buttonset">
      <ButtonSet {options} {legend} {legendPosition} bind:value={name} />
    </div>
  {/if}
  {#key name}
    <Video {name} {start} {stop} toggle={true} --min-height={minHeight} />
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
