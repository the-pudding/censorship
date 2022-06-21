<script>
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import Figure from "$components/Scroll.Figure.svelte";

  export let steps;
</script>

<Figure />
<div class="steps">
  <Scrolly>
    {#each steps as text}
      <div class="step text-outline">
        <p>
          <span class="bg" />
          <span>{@html text}</span>
        </p>
      </div>
    {/each}
  </Scrolly>
</div>

<style>
  .steps {
    /* TODO */
    --height: 640px;
    position: relative;
    margin-top: calc(var(--height) * -1);
  }

  .step {
    height: var(--height);
  }

  .step p {
    position: relative;
    padding: 16px;
  }

  span {
    position: relative;
  }

  .bg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    opacity: 0.75;
  }

  :global(.step mark) {
    text-shadow: none;
  }
</style>
