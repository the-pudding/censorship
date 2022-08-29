<script>
	import { onMount } from "svelte";
	import { scaleLinear } from "d3";
	import Icon from "$components/helpers/Icon.svelte";
	import ButtonSet from "$components/helpers/ButtonSet.svelte";

	export let name;
	export let toggle = false;
	export let censored = false;
	export let captioned = true;
	export let start = 0;
	export let stop = 0;

	const src = `assets/clips/${name}.mp4`;

	const durationCut = stop - start;
	const mid = durationCut / 2 + start;
	const scaleBefore = scaleLinear().domain([0, start]).range([0, mid]);
	const scaleAfter = scaleLinear();
	const initialCensoredValue = censored ? "Censored" : "Original";

	let videoEl;
	let duration;
	let currentTime = 0;
	let paused = true;
	let jumped = false;
	let autoplay = false;
	let loaded = false;
	let muted = false;
	let toggledByUser = false;
	let censoredValue = initialCensoredValue;

	const onCensored = () => {
		if (!toggledByUser) return;
		paused = true;
		videoEl.pause();
		videoEl.currentTime = 0;
		censored = censoredValue === "Censored";
		autoplay = true;
	};

	const onCaptions = () => {
		captioned = !captioned;
		videoEl.textTracks[0].mode = captioned ? "showing" : "hidden";
	};

	const onMute = () => {
		muted = !muted;
		videoEl.muted = muted;
	};

	const onPause = () => {
		paused = true;
	};

	const onPlay = () => {
		paused = false;
	};

	const onEnded = () => {
		currentTime = 0;
	};

	const onPlaypause = () => {
		if (paused) videoEl.play();
		else videoEl.pause();
	};

	const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

	$: if (!toggledByUser && initialCensoredValue !== censoredValue)
		toggledByUser = true;

	$: onCensored(censoredValue);
	$: playpauseIcon = paused ? "play-circle" : "pause-circle";
	$: playpauseText = paused ? "Play video" : "Pause video";
	$: muteIcon = muted ? "volume-x" : "volume-2";
	$: muteText = muted ? "Unmute video" : "Mute video";

	$: scaleAfter.domain([stop, duration]).range([mid, duration]);

	// reset jumped when video truly restarts
	$: jumped = currentTime === 0 ? false : jumped;

	$: progress =
		censored && jumped
			? scaleAfter(currentTime)
			: censored && !jumped
			? scaleBefore(currentTime)
			: currentTime || 0;

	$: leftCut = toPercent(mid, duration);
	$: widthCut = censored ? "2rem" : toPercent(durationCut, duration);
	$: widthElapsed = toPercent(progress, duration);

	// jump past censored clip
	$: if (censored && !jumped && !paused && currentTime > start) {
		jumped = true;
		videoEl.currentTime = stop;
	}

	// replay video after switching version
	$: if (autoplay && currentTime === 0 && paused) {
		autoplay = false;
		videoEl.play();
	}

	$: playing = !paused;

	onMount(() => {
		const request = new XMLHttpRequest();
		request.open("GET", src, true);

		request.responseType = "blob";
		request.onload = function () {
			if (this.status === 200) {
				const videoBlob = this.response;
				const videoUrl = URL.createObjectURL(videoBlob);
				videoEl.src = videoUrl;
				loaded = true;
			}
		};
		request.send();
	});
</script>

<figure class:loaded>
	<div class="video-wrapper">
		<video
			playsinline
			poster="assets/posters/{name}@2x.jpg"
			bind:this={videoEl}
			bind:currentTime
			bind:duration
			on:pause={onPause}
			on:play={onPlay}
			on:ended={onEnded}
		>
			<track
				label="English"
				kind="captions"
				srclang="en"
				src="assets/captions/{name}.vtt"
				default={captioned}
			/>
		</video>

		<div class="overlay" />

		<button
			aria-label={playpauseText}
			class="btn-playpause"
			class:playing
			on:click={onPlaypause}
		>
			<span>
				<Icon name={playpauseIcon} strokeWidth="1px" />
			</span>
		</button>

		<div class="controls">
			<button
				aria-label="Closed Captions"
				class="btn-captions"
				class:active={captioned}
				on:click={onCaptions}
				>CC
			</button>

			<button
				aria-label={muteText}
				class="btn-mute"
				class:active={!muted}
				on:click={onMute}
				><Icon name={muteIcon} strokeWidth="3px" />
			</button>
		</div>
	</div>

	{#if toggle && !isNaN(duration)}
		<div class="progress">
			<span style:width={widthElapsed} class="elapsed" />
			<span
				style:width={widthCut}
				style:left={leftCut}
				class="cut"
				class:censored>{Math.round(durationCut)}s</span
			>
		</div>
	{/if}

	{#if toggle && !isNaN(duration)}
		<div class="toggle" style="--left: {leftCut}">
			<ButtonSet
				options={[{ value: "Censored" }, { value: "Original" }]}
				--width={"7em"}
				bind:value={censoredValue}
			/>
		</div>
	{/if}

	{#if playing}
		<p class="mobile text-outline">Tap to pause</p>
	{/if}
</figure>

<style>
	figure {
		position: relative;
		min-height: var(--min-height, 160px);
		visibility: hidden;
		margin: 0;
	}

	figure.loaded {
		visibility: visible;
	}

	video {
		background: var(--color-gray-1000);
		border: 2px solid var(--color-gray-1000);
	}

	.controls {
		position: absolute;
		top: 8px;
		left: 8px;
		display: flex;
	}

	.controls button {
		line-height: 1;
		font-size: var(--16px);
		margin-right: 4px;
	}

	.controls button.active {
		background-color: var(--color-primary);
	}

	.progress {
		position: relative;
		width: 100%;
		height: 1rem;
		background: var(--color-gray-700);
		margin-top: 1rem;
	}

	span {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--color-gray-300);
		line-height: 1;
	}

	.cut {
		background: var(--color-primary);
		opacity: 0.75;
		transform: translate(-50%, 0);
		transition: all calc(var(--1s) * 0.5) ease-in-out;
		text-align: center;
		color: var(--color-bg);
	}

	.cut.censored {
		background: var(--color-bg);
		opacity: 1;
		color: var(--color-primary);
	}

	.cut:before,
	.cut:after {
		display: block;
		position: absolute;
		top: 0;
		line-height: 1;
		font-size: 2rem;
		color: var(--color-primary);
	}

	.cut:before {
		content: "[";
		left: 0;
		transform: translate(-50%, -32.5%);
	}

	.cut:after {
		content: "]";
		right: 0;
		transform: translate(50%, -32.5%);
	}

	div {
		position: relative;
	}

	:global(.video-wrapper svg) {
		display: block;
	}

	.toggle {
		text-align: center;
		left: 0;
		margin-top: 16px;
		text-transform: uppercase;
	}

	.video-wrapper .btn-playpause {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		background: transparent;
		line-height: 1;
		margin: 0;
		opacity: 1;
		transition: opacity calc(var(--1s) * 0.2) ease-in-out;
	}

	.video-wrapper .btn-playpause.playing {
		opacity: 0;
	}

	.video-wrapper .btn-playpause span {
		position: absolute;
		display: block;
		top: 50%;
		left: 50%;
		line-height: 1;
		transform: translate(-50%, -50%);
		font-size: var(--64px);
		width: 1em;
		height: 1em;
		border-radius: 50%;
		padding: 0;
		opacity: 0.7;
		text-align: center;
		background: transparent;
		color: var(--color-white);
		transition: opacity calc(var(--1s) * 0.2) ease-in-out;
	}

	.btn-playpause.playing {
		opacity: 0;
	}

	.btn-playpause:focus {
		opacity: 1;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
		opacity: 0.05;
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
	}

	video::cue {
		color: var(--color-fg);
		font-size: var(--14px);
		font-family: var(--sans);
		text-shadow: -1px -1px 1px var(--color-bg), -1px 0px 1px var(--color-bg),
			-1px 1px 1px var(--color-bg), -1px -1px 0px var(--color-bg),
			-1px 0px 0px var(--color-bg), 0px -1px 1px var(--color-bg),
			0px -1px 0px var(--color-bg), 0px 1px 0px var(--color-bg),
			0px 1px 1px var(--color-bg), 1px -1px 1px var(--color-bg),
			1px -1px 0px var(--color-bg), 1px 0px 0px var(--color-bg),
			1px 1px 0px var(--color-bg), 1px 1px 1px var(--color-bg),
			1px 0px 1px var(--color-bg);
	}

	.mobile {
		position: absolute;
		top: 8px;
		right: 8px;
		margin: 0;
		z-index: var(--z-top);
		color: var(--color-fg);
		opacity: 0.7;
		text-transform: uppercase;
		font-size: var(--12px);
		line-height: 1;
	}

	@media screen and (min-width: 40rem) {
		video::cue {
			font-size: var(--20px);
		}

		.toggle {
			position: absolute;
			transform: translate(-50%, 150%);
			bottom: 0;
			left: var(--left);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.btn-playpause:hover {
			opacity: 1;
		}

		.btn-playpause span:hover {
			opacity: 1;
		}

		.video-wrapper:hover .btn-playpause.playing {
			opacity: 1;
		}

		.mobile {
			display: none;
		}
	}
</style>
