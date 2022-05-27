<script>
  import { descending } from "d3";
  export let episodes;
  export let maxSeconds;

  const scenes = [].concat(...episodes.map((d) => d.scenes));
  scenes.sort((a, b) => descending(a.duration, b.duration));
  // scenes.sort(
  //   (a, b) =>
  //     descending(a.type === "sex", b.type === "sex") ||
  //     descending(a.type === "politics", b.type === "politics") ||
  //     descending(
  //       a.type === "non-hetero-relationship",
  //       b.type === "non-hetero-relationship"
  //     )
  // );
</script>

<p>Over Three Episodes of Removed Clips</p>
<figure>
  {#each scenes as { start, duration, type }}
    {@const width = `${(duration / maxSeconds) * 100}%`}
    <span style:width class={type} />
  {/each}
</figure>

<style>
  p {
    text-align: center;
  }

  figure {
    --height: 7px;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
  }

  span {
    display: block;
    position: relative;
    background: var(--color-gray-500);
    height: 6px;
    min-width: 2px;
    margin-bottom: 1px;
    outline: 1px solid var(--color-bg);
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
