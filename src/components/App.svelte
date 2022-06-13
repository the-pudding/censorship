<script>
  import { getContext } from "svelte";
  import Test from "$components/Test.svelte";
  import Title from "$components/Title.svelte";
  import Footer from "$components/Footer.svelte";
  import Toggle from "$components/Graphic.Toggle.svelte";
  import Quote from "$components/Graphic.Quote.svelte";
  import Compare from "$components/Graphic.Compare.svelte";
  import Scroll from "$components/Graphic.Scroll.svelte";
  import Video from "$lib/components/Graphic.Video.svelte";

  const copy = getContext("copy");
  const data = getContext("data");
  const components = { Toggle, Quote, Compare, Scroll, Video };
</script>

<!-- <Test /> -->

<article>
  <Title />
  {#each copy.sections as { id, chunks }}
    <section {id}>
      {#each chunks as { type, text, component, clips, steps }}
        <svelte:element this={type}>
          {#if text}
            {@html text}
          {:else}
            <svelte:component this={components[component]} {clips} {steps} />
          {/if}
        </svelte:element>
      {/each}
    </section>
  {/each}
</article>

<style>
</style>
