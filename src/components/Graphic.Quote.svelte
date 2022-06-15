<script>
  import { getContext, onMount } from "svelte";
  import cleanQuotes from "$utils/cleanQuotes.js";
  export let clips;

  const data = getContext("data");
  let clean = [];

  onMount(async () => {
    clean = await cleanQuotes({ data, clips: clips.slice(0, 1) });
  });
</script>

<figure>
  {#each clean as { id, lines, lineIndex }}
    <blockquote>
      <div class="bg" style="background-image: url(/assets/images/{id}.png);" />
      <p class="context text-outline">
        <span>{lines[lineIndex - 1].speaker}</span>{lines[lineIndex - 1].text}
      </p>

      <p class="censored text-outline">
        <span>{lines[lineIndex].speaker}</span>{@html lines[lineIndex].text}
      </p>

      <p class="context text-outline">
        <span>{lines[lineIndex + 1].speaker}</span>{lines[lineIndex + 1].text}
      </p>
    </blockquote>
  {/each}
</figure>

<style>
  blockquote {
    max-width: var(--col-width);
    margin: 1rem auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
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
