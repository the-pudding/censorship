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
    margin: 64px auto;
    min-height: 200px;
  }
</style>
