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
  $: minHeight = `${Math.max(200, offsetWidth / (16 / 9)) + 32}px`;
</script>

<div class="wrapper" bind:offsetWidth>
  {#if clips.length > 1}
    <div class="ui">
      <p>
        <span>Clip Source:</span>
        <span>{title}</span>
      </p>
      <div class="buttonset">
        <ButtonSet
          {options}
          {legend}
          {legendPosition}
          bind:value={name}
          --width={"2em"}
        />
      </div>
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
    max-width: var(--col-width);
    margin: var(--32px) auto;
    padding-bottom: 0px;
    min-height: 160px;
  }

  .ui {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column-reverse;
  }

  .ui p {
    margin: 0;
    font-size: var(--16px);
    line-height: 1;
    display: flex;
    flex-direction: row;
    margin-top: 16px;
  }

  p span:last-of-type {
    font-weight: bold;
    margin-left: 8px;
  }

  @media screen and (min-width: 30rem) {
    .ui {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }

    p span:last-of-type {
      margin-top: 4px;
      margin-left: 0;
    }

    .ui p {
      flex-direction: column;
      margin-top: 0;
    }
  }

  @media screen and (min-width: 40rem) {
    .wrapper {
      margin: var(--64px) auto;
      padding-bottom: 56px;
    }
  }
</style>
