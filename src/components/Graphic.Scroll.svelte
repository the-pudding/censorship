<script>
  export let steps;
</script>

<figure>
  <h2>Scroll Chart</h2>
</figure>

<div class="steps">
  {#each steps as text}
    <div class="step">
      <p>{@html text}</p>
    </div>
  {/each}
</div>
