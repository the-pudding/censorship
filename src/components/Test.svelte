<script>
  import { max, range, groups } from "d3";
  import cutsData from "$data/cuts.csv";
  import Lost from "$components/Test.Lost.svelte";
  import Video from "$components/Test.Video.svelte";

  const toSeconds = (str) => {
    const [m, s] = str.split(":").map((d) => +d);
    return s + m * 60;
  };

  const data = cutsData.map((d) => ({
    ...d,
    index: +d.index - 1,
    season: +d.season,
    episode: +d.episode,
    duration: +d.cut_seconds,
    start: toSeconds(d.cut_start),
    stop: toSeconds(d.cut_stop)
  }));

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

  let lost = true;
</script>

<section>
  <Video />
</section>

<!-- <section>
  <figure>
    {#each episodes as { index, scenes } (index)}
      {@const empty = !scenes.length}
      <div data-index={index} class:empty>
        {#each scenes as { start, duration, type }}
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
</section> -->
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
    height: 0;
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
