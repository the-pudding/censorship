<script>
  import { max, range, groups } from "d3";
  import cutsData from "$data/cuts.csv";

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
</script>

<figure>
  {#each episodes as { index, scenes }}
    {@const empty = !scenes.length}
    <div data-index={index} class:empty>
      {#each scenes as { start, duration, type }}
        {@const width = `${(duration / maxSeconds) * 100}%`}
        {@const left = `${(start / maxSeconds) * 100}%`}
        <span style:width style:left class={type} />
      {/each}
    </div>
  {/each}
</figure>

<style>
  figure {
    margin: 0 auto;
    max-width: 40rem;
  }

  div {
    border-bottom: 2px solid var(--color-bg);
    background: var(--color-gray-100);
    height: 8px;
    position: relative;
  }

  div.empty {
    background: var(--color-gray-50);
    /* background: var(--color-highlight); */
    height: 0;
    border: none;
    transition: all 1s ease-in-out;
  }

  span {
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--color-gray-500);
    min-width: 2px;
  }

  :global(span.sex) {
    background: red;
  }

  :global(span.politics) {
    background: green;
  }

  :global(span.non-hetero-relationship) {
    background: blue;
  }
</style>
