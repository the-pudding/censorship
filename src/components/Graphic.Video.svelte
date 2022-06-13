<script>
  import Video from "$components/Video.svelte";
  export let clips;

  $: name = clips[0];
</script>

<Video name={clips} />
