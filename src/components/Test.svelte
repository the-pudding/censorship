<script>
  import { max, range, groups } from "d3";
  import cutsData from "$data/cuts.csv";
  import Lost from "$components/Test.Lost.svelte";
  import Video from "$components/Video.svelte";

  const maxSeconds = max(data, (d) => d.stop);

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

  console.table(data);
  let lost = false;
</script>

<section>
  <Video name="a93_full" start={4.1} end={9.3} />
</section>

<section>
  <figure>
    {#each episodes as { index, scenes } (index)}
      {@const empty = !scenes.length}
      <div data-index={index} class:empty>
        {#each scenes as { start, stop, type }}
          {@const duration = stop - start}
          {@const width = `${(duration / maxSeconds) * 100}%`}
          {@const left = `${(start / maxSeconds) * 100}%`}
          <span style:width style:left class={type} class:lost />
        {/each}
      </div>
    {/each}
  </figure>
  {#if lost}
    <Lost {episodes} {maxSeconds} />
  {/if}
</section>

<style>
  section {
    position: relative;
    margin: 4rem auto;
    max-width: 40rem;
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
    background: hotpink;
  }

  :global(span.politics) {
    background: lawngreen;
  }

  :global(span.non-hetero-relationship) {
    background: turquoise;
  }
</style>
