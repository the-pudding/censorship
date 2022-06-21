<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3";
  import Icon from "$components/helpers/Icon.svelte";

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

  let videoEl;
  let duration;
  let currentTime = 0;
  let paused = true;
  let jumped = false;
  let autoplay = false;
  let loaded = false;
  let muted = false;

  const onCensored = () => {
    paused = true;
    videoEl.pause();
    videoEl.currentTime = 0;
    censored = !censored;
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

  const onPlaypause = () => {
    if (paused) videoEl.play();
    else videoEl.pause();
  };

  const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

  $: playpauseIcon = paused ? "play-circle" : "pause-circle";
  $: playpauseText = paused ? "Play video" : "Pause video";
  $: censoreText = censored ? "View original" : "View censored";
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
      bind:this={videoEl}
      bind:currentTime
      bind:duration
      on:pause={onPause}
      on:play={onPlay}
    >
      <track
        label="English"
        kind="captions"
        srclang="en"
        src="assets/captions/{name}.vtt"
        default
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
    <div>
      <button
        class:censored
        class="btn-censor"
        style:left={leftCut}
        on:click={onCensored}>{censoreText}</button
      >
    </div>
  {/if}
</figure>

<style>
  figure {
    position: relative;
    min-height: var(--min-height, 200px);
    visibility: hidden;
    margin: 0;
  }

  figure.loaded {
    visibility: visible;
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
    transition: all 0.5s ease-in-out;
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

  .btn-censor {
    position: absolute;
    top: 0;
    transform: translate(-50%, 50%);
    text-transform: uppercase;
    background-color: var(--color-primary);
  }

  .btn-censor.censored {
    background-color: var(--color-button-bg);
  }

  .btn-censor:hover {
    background-color: var(--color-button-hover);
  }

  .btn-censor.censored:hover {
    background-color: var(--color-button-hover);
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
    opacity: 0;
    transition: opacity 200ms ease-in-out;
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
    opacity: 0.5;
    text-align: center;
    background: transparent;
    color: var(--color-white);
    transition: opacity 200ms ease-in-out;
  }

  .btn-playpause:hover {
    opacity: 1;
  }

  .btn-playpause span:hover {
    opacity: 1;
  }

  .btn-playpause.playing {
    display: none;
  }

  .video-wrapper:hover .btn-playpause.playing {
    display: block;
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
    /* background: linear-gradient(to right, var(--color-fg), var(--color-fg)); */
    color: var(--color-fg);
    font-size: var(--20px);
    font-family: var(--sans);
    text-shadow: -1px -1px 1px var(--color-bg), -1px 0px 1px var(--color-bg),
      -1px 1px 1px var(--color-bg), -1px -1px 0px var(--color-bg),
      -1px 0px 0px var(--color-bg), 0px -1px 1px var(--color-bg),
      0px -1px 0px var(--color-bg), 0px 1px 0px var(--color-bg),
      0px 1px 1px var(--color-bg), 1px -1px 1px var(--color-bg),
      1px -1px 0px var(--color-bg), 1px 0px 0px var(--color-bg),
      1px 1px 0px var(--color-bg), 1px 1px 1px var(--color-bg),
      1px 0px 1px var(--color-bg);
    /* outline: 4px solid var(--color-fg); */
  }
</style>
