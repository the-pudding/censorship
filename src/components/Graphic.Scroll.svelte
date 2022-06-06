<script>
  export let steps;
</script>

<figure>
  <p>Scroll</p>
</figure>

<div class="steps">
  {#each steps as text}
    <div class="step">
      <p>{@html text}</p>
    </div>
  {/each}
</div>
