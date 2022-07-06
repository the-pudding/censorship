<script>
	import { getContext, onMount } from "svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import cleanQuotes from "$utils/cleanQuotes.js";
	import { animations } from "$stores/misc.js";
	export let clips;

	const data = getContext("data");
	let clean = [];
	let scrollIndex = 0;
	let count = 0;

	$: animated = $animations;
	$: scrollIndex = scrollIndex || 0;
	$: shift = `${scrollIndex * -16}px`;

	onMount(async () => {
		clean = await cleanQuotes({ data, clips });
		count = clean.length;
	});
</script>

<div class="wrapper" class:animated style="--count: {count}; --shift: {shift};">
	<figure>
		{#each clean as { id, lines, lineIndex, title }, i}
			{@const before = lines[lineIndex - 1]}
			{@const censored = lines[lineIndex]}
			{@const after = lines[lineIndex + 1]}
			{@const completed = scrollIndex > i}
			{@const z = count - i}
			<p class="title">{title}</p>
			<blockquote class:completed style="--i: {i}; --z: {z}">
				<div
					class="bg"
					style="background-image: url(assets/images/{id}.jpg);"
				/>

				<p class="censored text-outline">
					<span>{censored.speaker}</span>{@html censored.text}
				</p>
			</blockquote>
		{/each}
	</figure>

	{#if count}
		<div class="steps" class:animated>
			<Scrolly bind:value={scrollIndex}>
				{#each clean as { title }, i}
					{@const active = scrollIndex === i}
					<div class="step" class:active><p>{title}</p></div>
				{/each}
			</Scrolly>
		</div>
	{/if}
</div>

<style>
	:global(.cat-sex) {
		--color-quote: var(--color-primary);
	}

	:global(.cat-relationships) {
		--color-quote: var(--color-secondary);
	}

	.animated .wrapper {
		--height: 320px;
	}

	figure {
		--pad: 16px;
		width: 90%;
		position: relative;
	}

	.animated figure {
		position: sticky;
		top: 64px;
		left: 0;
		height: var(--height);
	}

	blockquote {
		--o: 12px;
		--offset: calc(var(--i) * var(--o));
		position: relative;
		background: var(--color-bg);
		height: var(--height);
		width: 85%;
		max-width: var(--col-width);
		margin: 0 auto;
		padding: var(--o);
		display: flex;
		flex-direction: column;
		justify-content: center;
		outline: 2px solid var(--color-quote);
		z-index: var(--z);
		transition: all calc(var(--1s) * 0.5) ease-in-out;
	}

	.animated blockquote {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate3d(
			calc(-50% + var(--offset) + var(--shift)),
			calc(var(--offset) + var(--shift)),
			0
		);
	}

	.animated blockquote.completed {
		transform: translate3d(
			calc(-50% + var(--offset) + var(--shift)),
			calc((var(--height) + (var(--count) * var(--pad))) * -1.05),
			0
		);
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		opacity: 0.5;
		transition: all calc(var(--1s) * 0.25);
	}

	.bg:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.25;
		background-image: repeating-linear-gradient(
				45deg,
				#000 25%,
				transparent 25%,
				transparent 75%,
				#000 75%,
				#000
			),
			repeating-linear-gradient(
				45deg,
				#000 25%,
				transparent 25%,
				transparent 75%,
				#000 75%,
				#000
			);
		background-position: 0 0, 2px 2px;
		background-size: 4px 4px;
		transition: all calc(var(--1s) * 0.25);
	}

	blockquote p {
		display: block;
		position: relative;
		margin: 0;
		padding: 16px 0;
	}

	.title {
		font-size: var(--16px);
		margin: 32px auto 8px auto;
	}

	.animated .title {
		display: none;
	}

	p.censored {
		--stroke-width: 2px;
		font-size: var(--24px);
		line-height: 1.1;
		color: var(--color-white);
		font-weight: bold;
	}

	:global(p.censored mark) {
		background-color: transparent;
		padding: 0;
		color: var(--color-quote);
	}

	p span {
		display: block;
		font-size: var(--16px);
	}

	.steps {
		display: none;
		position: relative;
		opacity: 1;
	}

	.animated .steps {
		display: block;
		margin-top: calc((var(--height) * -1) - 32px);
	}

	.step {
		color: var(--color-fg-darker);
		opacity: 0.25;
		pointer-events: none;
		max-width: var(--col-width);
		margin: 0 auto;
		transition: opacity calc(var(--1s) * 0.25) ease-in-out;
	}

	.animated .step {
		height: calc(var(--height));
	}

	.step.active {
		opacity: 1;
	}

	.step p {
		margin: 0;
		max-width: 100%;
		transform-origin: 0 0;
		display: inline-block;
		transform: rotate(-90deg) translate(-100%, -25%);
		line-height: 1;
		font-size: var(--14px);
	}

	@media screen and (min-width: 30rem) {
		.wrapper {
			--height: 400px;
		}

		p.censored {
			font-size: var(--32px);
		}

		.step p {
			transform: rotate(-90deg) translate(-100%, 25%);
		}
	}

	@media screen and (min-width: 40rem) {
		.wrapper {
			--height: 450px;
		}

		blockquote {
			--o: 16px;
		}

		p.censored {
			font-size: var(--48px);
		}

		p span {
			font-size: var(--20px);
		}

		.step p {
			font-size: var(--20px);
		}
	}

	@media screen and (min-width: 50rem) {
		.steps {
			margin-top: calc((var(--height) * -1) - 64px);
		}

		.step p {
			transform: rotate(-90deg) translate(-100%, -150%);
		}
	}
</style>
