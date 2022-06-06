<script>
  import Video from "$components/Video.svelte";
  export let clips;
  // export let start;
  // export let end;
  let censored = true;
</script>

<div>
  <Video name={clips} start={4.1} end={9.3} toggle={true} bind:censored />
</div>

<style>
  div {
    padding-bottom: 3.25rem;
  }
</style>
