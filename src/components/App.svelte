<script>
	import { getContext } from "svelte";
	import Title from "$components/Title.svelte";
	import Footer from "$components/Footer.svelte";
	import Toggle from "$components/Graphic.Toggle.svelte";
	import Quote from "$components/Graphic.Quote.svelte";
	import Compare from "$components/Graphic.Compare.svelte";
	import Scroll from "$components/Graphic.Scroll.svelte";
	import Video from "$components/Graphic.Video.svelte";
	// import Toggler from "$components/helpers/Toggle.svelte";
	import MotionToggle from "$lib/components/helpers/MotionToggle.svelte";

	const copy = getContext("copy");
	const data = getContext("data");
	const components = { Toggle, Quote, Compare, Scroll, Video };
</script>

<article>
	<div class="motion">
		<!-- <Toggler label="Motion" /> -->
		<MotionToggle />
	</div>
	<Title />
	{#each copy.sections as { id, chunks }}
		<section {id}>
			{#each chunks as { type, text, component, clips, steps, classname }}
				<svelte:element this={type} class={classname}>
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

<Footer />

<style>
	.motion {
		position: fixed;
		bottom: 16px;
		right: 16px;
	}
</style>
