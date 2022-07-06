<script>
	import { max } from "d3";
	import { getContext } from "svelte";
	import getEpisodes from "$data/getEpisodes.js";
	import viewport from "$stores/viewport.js";

	export let index;

	const data = getContext("data");
	const episodes = getEpisodes(data);

	let caption = { chart: "stacked bar chart", data: "", reason: "" };
	let figureWidth = 0;
	let example;
	const maxSeconds = max(data, (d) => d.timeStop);
	const maxMin = Math.ceil(maxSeconds / 60);

	const getTransform = ({ x, targetX, targetY, index, l, w }) => {
		const left = `${(l ? targetX : x) * w}px`;
		const top = l ? `${targetY * height}px` : `${index * height}px`;
		return `translate3d(${left}, ${top}, 0)`;
	};

	$: visible = index > 0;
	$: categorize = index > 1;
	$: lost = index > 5;
	$: height = Math.min(7, Math.floor($viewport.height / 100));
	$: {
		if (index === 3) example = "sex";
		else if (index === 4) example = "non-heteronormative-relationship";
		else if (index === 5) example = "disrespect";
		else example = undefined;
	}
	$: {
		if (index === 0) {
			caption.data = "100 episodes";
			caption.reason = "no values are depicted yet";
		} else if (index === 1) {
			caption.data = "100 episodes and 206 removed scenes";
			caption.reason =
				"the timestamp and duration of scenes removed is presented";
		} else if (index === 2) {
			caption.data = "77 episodes and 206 removed scenes";
			caption.reason =
				"the most common categories of 'sex', 'non-heteronormative relationships', and 'disrepsect' are compared";
		} else if (index === 3) {
			caption.data = "77 episodes and remove 206 scenes";
			caption.reason = "a single example of the 'sex' category is displayed";
		} else if (index === 4) {
			caption.data = "77 episodes and remove 206 scenes";
			caption.reason =
				"a single example of the 'non-heteronormative relationships' category is displayed";
		} else if (index === 5) {
			caption.data = "77 episodes and remove 206 scenes";
			caption.reason =
				"a single example of the 'disrespect' category is displayed";
		} else if (index === 6) {
			caption.data = "206 scenes";
			caption.reason = "they add up to nearly three episodes of length";
		}
	}

	$: figcaption = `${caption.chart} of ${caption.data} where ${caption.reason}`;
</script>

<figure
	id="scroll"
	style="--height: {height}px; --maxMin: {maxMin}m"
	class:visible
	class:categorize
	class:lost
>
	<div class="episodes" bind:clientWidth={figureWidth}>
		{#each episodes as { index, scenes } (index)}
			{@const empty = !scenes.length}
			<div class="episode" class:empty data-episode={index + 1}>
				{#each scenes as { width, i, x, type, targetY, targetX, content }}
					{@const transform = getTransform({
						x,
						targetY,
						targetX,
						index,
						l: lost,
						w: figureWidth
					})}
					<div
						class="scene {type}"
						class:elevate={!!content}
						data-tx={targetX}
						data-ty={targetY}
						style:width
						style:transform
						style="--delay: {i};"
					>
						{#if content}
							<span
								class="content"
								class:visible={example === type}
								class:left={targetX > 0.75}
								class:right={targetX < 0.25}>{content}</span
							>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<figcaption class="sr-only" aria-live="polite">{figcaption}</figcaption>
</figure>

<style>
	figure {
		--dur: var(--1s);
		--ease: ease-in-out;
		position: sticky;
		top: 2rem;
		left: 0;
		overflow: hidden;
		padding-bottom: var(--height);
		padding-top: calc(var(--height) * 3);
	}

	.episodes {
		width: 85%;
		margin: 0 auto;
	}

	.episodes:before {
		content: "0 minutes";
		display: block;
		position: absolute;
		top: -8px;
		left: 0;
		transform: translate(0, calc(var(--height) * -1));
		font-size: var(--14px);
		line-height: 1;
		color: var(--color-gray-400);
	}

	.episodes:after {
		content: "21 m";
		display: block;
		position: absolute;
		top: -8px;
		right: 0;
		transform: translate(0, calc(var(--height) * -1));
		font-size: var(--14px);
		line-height: 1;
		color: var(--color-gray-400);
	}

	.episode {
		background: var(--color-gray-700);
		height: var(--height);
		transition: all var(--dur) var(--ease);
		border-bottom: 1px solid var(--color-bg);
	}

	[data-episode="1"]:before {
		content: "#1";
		display: block;
		position: absolute;
		top: 0;
		left: -8px;
		transform: translate(-100%, calc(var(--height) * 0.5));
		font-size: var(--14px);
		line-height: 1;
		color: var(--color-gray-400);
	}

	[data-episode="100"]:before {
		content: "#100";
		display: none;
		position: absolute;
		bottom: 0;
		left: -8px;
		transform: translate(-100%, calc(var(--height) * 0.5));
		font-size: var(--14px);
		line-height: 1;
		color: var(--color-gray-400);
	}

	.scene.elevate {
		z-index: var(--z-top);
	}

	.scene {
		display: block;
		position: absolute;
		height: calc(var(--height) - 1px);
		min-width: 2px;
		transition: all var(--dur) var(--ease),
			transform var(--dur) calc(var(--delay) * calc(var(--1s) * 0.01))
				var(--ease);
		opacity: 0;
		top: 0;
		left: 0;
	}

	.content {
		font-size: var(--14px);
		display: block;
		width: 15em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform-origin: 50% 50%;
		transform: translate(-50%, -50%) scale(0);
		line-height: 1.2;
		color: var(--color-bg);
		padding: 8px;
		border: 2px solid var(--color-gray-1000);
		opacity: 0;
		transition: transform calc(var(--1s) * 0.75) ease-in-out,
			opacity calc(var(--1s) * 0.1);
		text-shadow: none;
	}

	.content.left {
		left: auto;
		right: 0;
		transform-origin: 100% 50%;
		transform: translate(0%, -50%) scale(0);
	}

	.content.right {
		left: 0;
		transform-origin: 0% 50%;
		transform: translate(0%, -50%) scale(0);
	}

	.content.visible {
		opacity: 1;
		transform: translate(-10%, -50%) scale(1);
	}

	.content.left.visible {
		transform: translate(0%, -50%) scale(1);
	}

	.content.right.visible {
		transform: translate(-50%, -50%) scale(1);
	}

	.visible .episode.empty {
		background: var(--color-gray-800);
	}

	.visible .scene {
		opacity: 1;
		background: var(--color-gray-500);
	}

	.lost .episode,
	.lost .episode.empty {
		background: var(--color-gray-700);
	}

	:global(.visible.categorize .scene.sex) {
		background: var(--color-primary);
	}

	:global(.visible.categorize .scene.non-heteronormative-relationship) {
		background: var(--color-secondary);
	}

	:global(.visible.categorize .scene.disrespect) {
		background: var(--color-tertiary);
	}

	:global(.scene.sex .content) {
		background: var(--color-primary);
	}

	:global(.scene.non-heteronormative-relationship .content) {
		background: var(--color-secondary);
	}

	:global(.scene.disrespect .content) {
		background: var(--color-tertiary);
	}

	@media screen and (min-width: 40rem) {
		.content {
			font-size: var(--16px);
		}

		.content.visible {
			transform: translate(-50%, -50%) scale(1);
		}

		.content.right.visible {
			transform: translate(0, -50%) scale(1);
		}

		.episodes {
			width: 80%;
			margin: 0 auto;
		}

		[data-episode="1"]:before {
			content: "Episode #1";
		}

		[data-episode="100"]:before {
			display: block;
		}
	}
</style>
