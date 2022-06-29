<script>
  import { getContext, onMount } from "svelte";
  import Icon from "$components/helpers/Icon.svelte";
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import cleanQuotes from "$utils/cleanQuotes.js";
  export let clips;

  const data = getContext("data");
  let clean = [];
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
      <blockquote class:completed style="--i: {i}; --z: {z}">
        <div
          class="bg"
          style="background-image: url(assets/images/{id}.jpg);"
        />

        <p class="censored text-outline">
          <span>{censored.speaker}</span>{@html censored.text}
        </p>
      </blockquote>
    {/each}
  </figure>

  {#if count}
    <div class="steps">
      <Scrolly bind:value={scrollIndex}>
        {#each clean as { title }, i}
          {@const active = scrollIndex === i}
          <div class="step" class:active><p>{title}</p></div>
        {/each}
      </Scrolly>
    </div>
  {/if}
</div>

<style>
  :global(.cat-sex) {
    --color-quote: var(--color-primary);
  }

  :global(.cat-relationships) {
    --color-quote: var(--color-secondary);
  }

  figure {
    --pad: 16px;
    position: sticky;
    top: 64px;
    left: 0;
    height: var(--height);
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
    transform: translate3d(
      calc(-50% + var(--offset) + var(--shift)),
      calc(var(--offset) + var(--shift)),
      0
    );
    outline: 2px solid var(--color-quote);
    z-index: var(--z);
    transition: all 0.5s ease-in-out;
  }

  blockquote.completed {
    transform: translate3d(
      calc(-50% + var(--offset) + var(--shift)),
      calc((var(--height) + (var(--count) * var(--pad))) * -1.05),
      0
    );
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

  blockquote p {
    display: block;
    position: relative;
    margin: 0;
    padding: 16px 0;
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
    color: var(--color-quote);
  }

  p span {
    display: block;
    font-size: var(--20px);
  }

  .steps {
    position: relative;
    opacity: 1;
    margin-top: calc((var(--height) * -1) - 64px);
    pointer-events: none;
  }

  .step {
    color: var(--color-fg-darker);
    height: calc(var(--height));
    opacity: 0.25;
    pointer-events: none;
    max-width: var(--col-width);
    margin: 0 auto;
    transition: opacity 250ms ease-in-out;
  }

  .step.active {
    opacity: 1;
  }

  .step p {
    margin: 0;
    max-width: 100%;
    transform-origin: 0 0;
    display: inline-block;
    transform: rotate(-90deg) translate(-100%, -150%);
    line-height: 1;
    font-size: var(--20px);
  }
</style>
