<script>
  import { getContext } from "svelte";
  import getEpisodes from "$data/getEpisodes.js";

  const data = getContext("data");

  const episodes = getEpisodes(data);

  let lost = false;
</script>

<figure>
  {#each episodes as { index, scenes } (index)}
    {@const empty = !scenes.length}
    <div class:empty>
      {#each scenes as { width, left, type, targetY, targetX }}
        <span
          data-tx={targetX}
          data-ty={targetY}
          style:width
          style:left
          class={type}
          class:lost
        />
      {/each}
    </div>
  {/each}
</figure>

<style>
  figure {
    --height: 7px;
    position: sticky;
    top: 2rem;
    left: 0;
    width: 90%;
  }

  div {
    position: relative;
    background: var(--color-gray-700);
    height: var(--height);
  }

  div:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--color-bg);
  }

  div.empty {
    background: var(--color-gray-800);
    transition: height 1s ease-in-out;
    /* height: 0; */
  }

  span {
    display: block;
    position: absolute;
    top: 0;
    height: calc(var(--height) - 1px);
    min-width: 2px;
    transition: opacity;
  }

  span.lost {
    opacity: 0;
  }

  :global(figure span) {
    background: var(--color-gray-500);
  }

  :global(figure span.sex) {
    background: var(--color-primary);
  }

  :global(figure span.disrespect) {
    background: var(--color-secondary);
  }

  :global(figure span.non-heteronormative-relationship) {
    background: var(--color-tertiary);
  }
</style>
