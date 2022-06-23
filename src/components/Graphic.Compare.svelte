<script>
  export let clips;
</script>

<div>
  {#each clips as { image, alt, figcaption }}
    <figure>
      <img src="assets/images/{image}.jpg" {alt} />
      <figcaption>{@html figcaption}</figcaption>
    </figure>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    max-width: 1280px;
    margin: 64px auto;
  }

  figure {
    margin: 0 4px;
  }
  figcaption {
    text-align: center;
    margin-top: 4px;
    color: var(--color-fg-darker);
  }

  img {
    border: 2px solid var(--color-gray-1000);
  }

  @media screen and (min-width: 40rem) {
    div {
      flex-direction: row;
    }
  }
</style>
