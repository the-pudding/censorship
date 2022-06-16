<script>
  import { getContext, onMount } from "svelte";
  import Icon from "$components/helpers/Icon.svelte";
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import cleanQuotes from "$utils/cleanQuotes.js";
  export let clips;

  const data = getContext("data");
  let clean = [];
  let scrollIndex = 0;
  let showContext = [];

  onMount(async () => {
    clean = await cleanQuotes({ data, clips });
    showContext = clean.map(() => false);
  });
</script>

<figure>
  {#each clean as { id, lines, lineIndex }, i}
    {@const before = lines[lineIndex - 1]}
    {@const censored = lines[lineIndex]}
    {@const after = lines[lineIndex + 1]}
    {@const active = scrollIndex === i}
    {@const completed = scrollIndex > i}
    {@const z = scrollIndex - i}
    {@const sc = showContext[i]}
    <blockquote
      class:active
      class:completed
      class:show-context={sc}
      style="--i: {i}; --z: {z}"
    >
      <div class="bg" style="background-image: url(/assets/images/{15}.png);" />
      <p class="context text-outline">
        <span>{before.speaker}</span>{before.text}
      </p>

      <p class="censored text-outline">
        <span>{censored.speaker}</span>{@html censored.text}
      </p>

      <p class="context text-outline">
        <span>{after.speaker}</span>{after.text}
      </p>

      <button aria-label="Show Context" on:click={() => (showContext[i] = !sc)}
        ><Icon name={sc ? "eye" : "eye-off"} /></button
      >
    </blockquote>
  {/each}
</figure>

{#if clean.length}
  <div class="steps">
    <Scrolly bind:value={scrollIndex}>
      {#each clean as { id }, i}
        <div class="step" />
      {/each}
    </Scrolly>
  </div>
{/if}

<style>
  figure {
    position: sticky;
    top: 0;
    left: 0;
    height: 564px;
    /* background: green; */
  }

  blockquote {
    --offset: calc(var(--i) * 16px);
    position: absolute;
    background: var(--color-bg);
    top: 64px;
    left: 50%;
    height: 500px;
    max-width: var(--col-width);
    margin: 1rem auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(calc(-50% + var(--offset)), var(--offset));
    outline: 2px solid var(--color-primary);
    z-index: var(--z);
    transition: top 500ms ease-in-out;
  }

  blockquote.completed {
    top: -200%;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    opacity: 0.5;
  }

  p {
    display: block;
    position: relative;
    margin: 0;
    padding: 16px 0;
  }

  p.context {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    font-size: var(--18px);
  }

  p.censored {
    --stroke-width: 2px;
    font-size: var(--56px);
    line-height: 1.1;
    color: var(--color-white);
    font-weight: bold;
  }

  :global(p.censored mark) {
    background-color: transparent;
    padding: 0;
    color: var(--color-primary);
  }

  span {
    display: block;
    font-size: var(--20px);
  }

  button {
    width: 2em;
    height: 2em;
    padding: 0;
    line-height: 1;
    position: absolute;
    bottom: 16px;
    right: 16px;
  }

  .show-context .context {
    opacity: 1;
  }

  .steps {
    position: relative;
    opacity: 0.5;
    margin-top: -250px;
    pointer-events: none;
  }

  .step {
    height: 50vh;
    background: red;
    opacity: 0;
    border: 2px solid white;
    pointer-events: none;
    /* visibility: hidden; */
  }
</style>
