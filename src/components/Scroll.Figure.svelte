<script>
  import { getContext } from "svelte";
  import { max, range, groups } from "d3";

  const data = getContext("data");
  const maxSeconds = max(data, (d) => d.timeStop);
  console.log(maxSeconds);

  const episodeCount = 100;

  const grouped = groups(data, (d) => d.index);

  const getScenes = (index) => {
    const match = grouped.find(([i]) => i === index);
    return match ? match[1] : [];
  };

  const episodes = range(episodeCount).map((d, index) => ({
    index,
    scenes: getScenes(index)
  }));

  let lost = false;
</script>

<figure>
  {#each episodes as { index, scenes } (index)}
    {@const empty = !scenes.length}
    <div data-index={index} class:empty>
      {#each scenes as { timeStart, timeStop, type }}
        {@const duration = timeStop - timeStart}
        {@const width = `${(duration / maxSeconds) * 100}%`}
        {@const left = `${(timeStart / maxSeconds) * 100}%`}
        <span style:width style:left class={type} class:lost />
      {/each}
    </div>
  {/each}
</figure>

<style>
  figure {
    position: sticky;
    top: 2rem;
    left: 0;
    width: 90%;
    max-width: 1280px;
  }

  div {
    --height: 7px;
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
    background: var(--color-gray-500);
    min-width: 2px;
    transition: opacity;
  }

  span.lost {
    opacity: 0;
  }

  :global(span.sex) {
    background: var(--color-primary);
  }

  :global(span.disrespect) {
    background: var(--color-secondary);
  }

  :global(span.non-heteronormative-relationship) {
    background: var(--color-tertiary);
  }
</style>
