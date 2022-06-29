<script>
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import Figure from "$components/Scroll.Figure.svelte";
  import viewport from "$stores/viewport.js";

  export let steps;
  let value = 0;

  $: scrollIndex = value || 0;
  $: height = `${$viewport.height}px`;
  $: marginTop = `${$viewport.height * -0.5}px`;
</script>

<Figure index={scrollIndex} />
<div class="steps" style:margin-top={marginTop}>
  <Scrolly bind:value>
    {#each steps as text}
      <div class="step text-outline" style:height>
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
    position: relative;
  }

  .step {
    min-height: 480px;
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
