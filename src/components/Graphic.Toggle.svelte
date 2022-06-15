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
    const label = i + 1;
    return { label, value };
  });

  let censored = true;
  let name = clips[0];

  $: datum = data.find((d) => d.id === name);
  $: start = datum.start;
  $: stop = datum.stop;
  $: title = `Season ${datum.season} Episode ${datum.episode}`;
  $: minHeight = `${Math.max(200, offsetWidth / (16 / 9))}px`;
</script>

<div class="wrapper" bind:offsetWidth>
  {#if clips.length > 1}
    <div class="ui">
      <p>
        <span>Clip Source:</span>
        <span>{title}</span>
      </p>
      <ButtonSet {options} {legend} {legendPosition} bind:value={name} />
    </div>
  {/if}
  {#key name}
    <Video
      {name}
      {start}
      {stop}
      censored={true}
      toggle={true}
      --min-height={minHeight}
    />
  {/key}
</div>

<style>
  .wrapper {
    padding-bottom: 3.25rem;
    max-width: var(--col-width);
    margin: var(--64px) auto;
    min-height: 200px;
  }

  .ui {
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    /* background: var(--color-fg);
    color: var(--color-bg); */
  }

  .ui p {
    margin: 0;
    font-size: var(--16px);
    line-height: 1;
    display: flex;
    flex-direction: column;
  }

  p span:last-of-type {
    font-weight: bold;
    margin-top: 4px;
  }
</style>
