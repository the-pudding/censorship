<script>
  import { getContext, onMount } from "svelte";
  import Icon from "$components/helpers/Icon.svelte";
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import cleanQuotes from "$utils/cleanQuotes.js";
  export let clips;

  const data = getContext("data");
  let clean = [];
  let showContext = [];
  let scrollIndex = 0;
  let count = 0;

  $: height = `${500}px`;
  $: scrollIndex = scrollIndex || 0;
  $: shift = `${scrollIndex * -16}px`;

  onMount(async () => {
    clean = await cleanQuotes({ data, clips });
    showContext = clean.map(() => false);
    count = clean.length;
  });
</script>

<div
  class="wrapper"
  style="--height: {height}; --count: {count}; --shift: {shift};"
>
  <figure>
    {#each clean as { id, lines, lineIndex }, i}
      {@const before = lines[lineIndex - 1]}
      {@const censored = lines[lineIndex]}
      {@const after = lines[lineIndex + 1]}
      {@const completed = scrollIndex > i}
      {@const z = count - i}
      {@const sc = showContext[i]}
      <blockquote
        class:completed
        class:show-context={sc}
        style="--i: {i}; --z: {z}"
      >
        <div
          class="bg"
          style="background-image: url(/assets/images/{15}.png);"
        />

        {#if before}
          <p class="context text-outline">
            <span>{before.speaker}</span>{before.text}
          </p>
        {/if}

        <p class="censored text-outline">
          <span>{censored.speaker}</span>{@html censored.text}
        </p>

        {#if after}
          <p class="context text-outline">
            <span>{after.speaker}</span>{after.text}
          </p>
        {/if}

        <button
          aria-label="Show Context"
          on:click={() => (showContext[i] = !sc)}
          ><Icon name={sc ? "eye" : "eye-off"} /></button
        >
      </blockquote>
    {/each}
  </figure>

  {#if count}
    <div class="steps">
      <Scrolly bind:value={scrollIndex}>
        {#each clean as { id }, i}
          <div class="step" />
        {/each}
      </Scrolly>
    </div>
  {/if}
</div>

<style>
  figure {
    --pad: 16px;
    position: sticky;
    top: 64px;
    left: 0;
    height: var(--height);
    /* background: green; */
  }

  blockquote {
    --offset: calc(var(--i) * 16px);
    position: absolute;
    background: var(--color-bg);
    top: 0;
    left: 50%;
    height: var(--height);
    max-width: var(--col-width);
    margin: 0 auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(
      calc(-50% + var(--offset) + var(--shift)),
      calc(var(--offset) + var(--shift))
    );
    outline: 2px solid var(--color-primary);
    z-index: var(--z);
    transition: top 0.5s ease-in-out, transform 0.5s ease-in-out;
  }

  blockquote.completed {
    top: calc((var(--height) + (var(--count) * var(--pad))) * -1);
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
    transition: all 250ms;
  }

  .bg:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.25;
    background-image: repeating-linear-gradient(
        45deg,
        #000 25%,
        transparent 25%,
        transparent 75%,
        #000 75%,
        #000
      ),
      repeating-linear-gradient(
        45deg,
        #000 25%,
        transparent 25%,
        transparent 75%,
        #000 75%,
        #000
      );
    background-position: 0 0, 2px 2px;
    background-size: 4px 4px;
    transition: all 250ms;
  }

  .show-context .bg {
    opacity: 0.25;
  }

  .show-context .bg:after {
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
    transition: opacity 0.25s ease-in-out;
    font-size: var(--18px);
  }

  p.censored {
    --stroke-width: 2px;
    font-size: var(--48px);
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
    opacity: 1;
    margin-top: calc((var(--height)) * -0.5 - 64px);
    pointer-events: none;
  }

  .step {
    height: var(--height);
    background: red;
    opacity: 1;
    outline: 2px solid white;
    pointer-events: none;
    width: 100px;
    /* visibility: hidden; */
  }
</style>
