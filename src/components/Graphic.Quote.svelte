<script>
  import { getContext, onMount } from "svelte";
  import cleanQuotes from "$utils/cleanQuotes.js";
  export let clips;

  const data = getContext("data");
  let clean = [];

  onMount(async () => {
    clean = await cleanQuotes({ data, clips });
    console.log(clean);
  });
</script>

<figure>
  {#each clean as { id, lines, lineIndex }, i}
    {@const before = lines[lineIndex - 1]}
    {@const censored = lines[lineIndex]}
    {@const after = lines[lineIndex + 1]}
    <blockquote style="--i: {i}; --z: {clean.length - i}">
      <div class="bg" style="background-image: url(/assets/images/{15}.png);" />
      <p class="context text-outline">
        <span>{before.speaker}</span>{before.text}
      </p>

      <p class="censored text-outline">
        <span>{censored.speaker}</span>{@html censored.text}
      </p>

      <p class="context text-outline">
        <span>{after.speaker}</span>{after.text}
      </p>
    </blockquote>
  {/each}
</figure>

<style>
  figure {
    position: relative;
    height: 100vh;
  }

  blockquote {
    --offset: calc(var(--i) * 16px);
    position: absolute;
    background: var(--color-bg);
    top: 0;
    left: 50%;
    height: 500px;
    max-width: var(--col-width);
    margin: 1rem auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translate(calc(-50% + var(--offset)), var(--offset));
    outline: 2px solid var(--color-primary);
    z-index: var(--z);
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
  }

  p {
    display: block;
    position: relative;
    margin: 0;
    padding: 16px 0;
  }

  p.context {
    /* visibility: hidden; */
  }

  p.censored {
    --stroke-width: 2px;
    font-size: var(--64px);
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
</style>
