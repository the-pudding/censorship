<script>
	import { onMount } from "svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Figure from "$components/Scroll.Figure.svelte";
	import Toggle from "$components/helpers/Toggle.svelte";
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	import viewport from "$stores/viewport.js";
	import { animations } from "$stores/misc.js";

	export let steps;
	let value = 0;
	let stepEls = [];
	let vh = 0;

	const jump = (i) => {
		const { top } = stepEls[i].getBoundingClientRect();
		window.scrollTo(0, window.scrollY + top - 32);
	};

	$: scrollIndex = value || 0;
	$: height = $animations ? `${vh}px` : "auto";
	$: marginTop = $animations ? `${vh * -0.5}px` : "0";
	$: animated = $animations;
	$: if (vh && $viewport.width) vh = window.innerHeight;

	onMount(() => {
		vh = window.innerHeight;
	});
</script>

{#if $animations}
	<Figure index={scrollIndex} />
{/if}

<div class="steps" style:margin-top={marginTop} class:animated>
	<Scrolly bind:value>
		{#each steps as text, i}
			<div bind:this={stepEls[i]} class="step text-outline" style:height>
				<p>
					<span class="bg" />
					<span>{@html text}</span>
				</p>
				{#if !$animations}
					<Figure index={i} />
				{/if}
			</div>
		{/each}
	</Scrolly>
</div>

<style>
	.steps {
		position: relative;
		width: 85%;
		margin-left: auto;
		margin-right: auto;
		pointer-events: none;
	}

	.animated .step {
		min-height: 480px;
	}

	.animated .step p {
		padding: 16px;
	}

	.step p {
		position: relative;
		padding: 16px 0;
		pointer-events: all;
	}

	.step span {
		position: relative;
	}

	.step .bg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--color-bg);
		opacity: 0.75;
	}

	:global(.step mark) {
		text-shadow: none;
	}

	@media screen and (min-width: 40rem) {
		.steps {
			width: 100%;
		}
	}
</style>
