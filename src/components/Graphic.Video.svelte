<script>
  import Video from "$components/Video.svelte";
  export let clips;

  $: name = clips[0];
</script>

<div>
  <Video name={clips} captioned={false} />
</div>

<style>
  div {
    max-width: var(--col-width);
    margin: var(--32px) auto;
    min-height: 160px;
  }

  @media screen and (min-width: 60rem) {
    div {
      margin: var(--64px) auto;
    }
  }
</style>
