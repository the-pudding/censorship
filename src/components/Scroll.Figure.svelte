<script>
  import { getContext } from "svelte";
  import getEpisodes from "$data/getEpisodes.js";
  import viewport from "$stores/viewport.js";

  export let index;

  const data = getContext("data");
  const episodes = getEpisodes(data);

  let figureWidth = 0;
  let example;

  const getTransform = ({ x, targetX, targetY, index, l, w }) => {
    const left = `${(l ? targetX : x) * w}px`;
    const top = l ? `${targetY * height}px` : `${index * height}px`;
    return `translate3d(${left}, ${top}, 0)`;
  };

  $: visible = index > 0;
  $: categorize = index > 1;
  $: lost = index > 5;
  $: height = Math.min(7, Math.floor($viewport.height / 100));
  $: {
    if (index === 3) example = "sex";
    else if (index === 4) example = "non-heteronormative-relationship";
    else if (index === 5) example = "disrespect";
    else example = undefined;
  }
</script>

<figure
  id="scroll"
  bind:clientWidth={figureWidth}
  style="--height: {height}px;"
  class:visible
  class:categorize
  class:lost
>
  {#each episodes as { index, scenes } (index)}
    {@const empty = !scenes.length}
    <div class="episode" class:empty data-episode={index}>
      {#each scenes as { width, i, x, type, targetY, targetX, content }}
        {@const transform = getTransform({
          x,
          targetY,
          targetX,
          index,
          l: lost,
          w: figureWidth
        })}
        <div
          class="scene {type}"
          class:elevate={!!content}
          data-tx={targetX}
          data-ty={targetY}
          style:width
          style:transform
          style="--delay: {i};"
        >
          {#if content}
            <span
              class="content"
              class:visible={example === type}
              class:left={targetX > 0.75}
              class:right={targetX < 0.25}>{content}</span
            >
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</figure>

<style>
  figure {
    --dur: 1s;
    --ease: ease-in-out;
    position: sticky;
    top: 2rem;
    left: 0;
    width: 90%;
    overflow: hidden;
  }

  .episode {
    background: var(--color-gray-700);
    height: var(--height);
    transition: all var(--dur) var(--ease);
    border-bottom: 1px solid var(--color-bg);
  }

  .scene.elevate {
    z-index: var(--z-top);
  }

  .scene {
    display: block;
    position: absolute;
    height: calc(var(--height) - 1px);
    min-width: 2px;
    transition: all var(--dur) var(--ease),
      transform var(--dur) calc(var(--delay) * 10ms) var(--ease);
    opacity: 0;
    top: 0;
    left: 0;
  }

  .content {
    font-size: var(--14px);
    display: block;
    width: 15em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%) scale(0);
    line-height: 1.2;
    color: var(--color-bg);
    padding: 8px;
    border: 2px solid var(--color-gray-1000);
    opacity: 0;
    transition: transform 750ms ease-in-out, opacity 100ms;
  }

  .content.left {
    left: auto;
    right: 0;
    transform-origin: 100% 50%;
    transform: translate(0%, -50%) scale(0);
  }

  .content.right {
    left: 0;
    transform-origin: 0% 50%;
    transform: translate(0%, -50%) scale(0);
  }

  .content.visible {
    opacity: 1;
    transform: translate(-10%, -50%) scale(1);
  }

  .content.left.visible {
    transform: translate(0%, -50%) scale(1);
  }

  .content.right.visible {
    transform: translate(-50%, -50%) scale(1);
  }

  .visible .episode.empty {
    background: var(--color-gray-800);
  }

  .visible .scene {
    opacity: 1;
    background: var(--color-gray-500);
  }

  .lost .episode,
  .lost .episode.empty {
    background: var(--color-gray-700);
  }

  :global(.visible.categorize .scene.sex) {
    background: var(--color-primary);
  }

  :global(.visible.categorize .scene.non-heteronormative-relationship) {
    background: var(--color-secondary);
  }

  :global(.visible.categorize .scene.disrespect) {
    background: var(--color-tertiary);
  }

  :global(.scene.sex .content) {
    background: var(--color-primary);
  }

  :global(.scene.non-heteronormative-relationship .content) {
    background: var(--color-secondary);
  }

  :global(.scene.disrespect .content) {
    background: var(--color-tertiary);
  }

  @media screen and (min-width: 40rem) {
    .content {
      font-size: var(--16px);
    }

    .content.visible {
      transform: translate(-50%, -50%) scale(1);
    }

    .content.right.visible {
      transform: translate(0, -50%) scale(1);
    }
  }
</style>
