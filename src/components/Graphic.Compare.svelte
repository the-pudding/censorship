<script>
  export let clips;
</script>

<div>
  {#each clips as { image, alt, figcaption }}
    <figure>
      <img src="assets/images/{image}.jpg" {alt} />
      <figcaption>{figcaption}</figcaption>
    </figure>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    max-width: 1280px;
    margin: 32px auto;
  }

  figcaption {
    text-align: center;
  }

  @media screen and (min-width: 40rem) {
    div {
      flex-direction: row;
    }
  }
</style>
