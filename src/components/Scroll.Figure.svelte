<script>
  import { getContext } from "svelte";
  import getEpisodes from "$data/getEpisodes.js";

  export let index;

  const data = getContext("data");
  const episodes = getEpisodes(data);

  let figureWidth = 0;

  const getTransform = ({ x, targetX, targetY, index, l, w }) => {
    const left = `${(l ? targetX : x) * w}px`;
    const top = l ? `${targetY * height}px` : `${index * height}px`;
    return `translate3d(${left}, ${top}, 0)`;
  };

  $: visible = index > 0;
  $: categorize = index > 1;
  $: lost = index > 2;
  $: height = 7;
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
    <div class="episode" class:empty>
      {#each scenes as { width, i, x, type, targetY, targetX }}
        {@const transform = getTransform({
          x,
          targetY,
          targetX,
          index,
          l: lost,
          w: figureWidth
        })}
        <span
          class="scene {type}"
          data-tx={targetX}
          data-ty={targetY}
          style:width
          style:transform
          style="--delay: {i};"
        />
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
  }

  .episode {
    background: var(--color-gray-700);
    height: var(--height);
    transition: all var(--dur) var(--ease);
    border-bottom: 1px solid var(--color-bg);
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

  :global(.visible.categorize .scene.disrespect) {
    background: var(--color-secondary);
  }

  :global(.visible.categorize .scene.non-heteronormative-relationship) {
    background: var(--color-tertiary);
  }
</style>
