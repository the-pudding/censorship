<script>
  import { tick } from "svelte";
  import { scaleLinear } from "d3";
  import Icon from "$components/helpers/Icon.svelte";

  export let name;
  export let start;
  export let end;
  export let censored = true;

  const durationCut = end - start;
  const mid = durationCut / 2 + start;
  const scaleBefore = scaleLinear().domain([0, start]).range([0, mid]);
  const scaleAfter = scaleLinear();

  let videoEl;
  let trackEl;
  let duration;
  let currentTime = 0;
  let paused = true;
  let jumped = false;
  let autoplay = false;

  const onCensored = () => {
    paused = true;
    videoEl.pause();
    videoEl.currentTime = 0;
    censored = !censored;
    autoplay = true;
  };

  const onPause = () => {
    paused = true;
  };

  const onPlay = () => {
    paused = false;
  };

  const onToggle = () => {
    if (paused) videoEl.play();
    else videoEl.pause();
  };

  const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

  $: buttonName = paused ? "play-circle" : "pause-circle";
  $: censoreText = censored ? "View original" : "View censored";
  $: toggleText = paused ? "Play video" : "Pause video";

  $: scaleAfter.domain([end, duration]).range([mid, duration]);

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
    videoEl.currentTime = end;
  }

  // replay video after switching version
  $: if (autoplay && currentTime === 0 && paused) {
    autoplay = false;
    videoEl.play();
  }

  $: playing = !paused;
</script>

<div>
  <div class="video-wrapper">
    <video
      src="assets/clips/{name}.mp4"
      bind:this={videoEl}
      bind:currentTime
      bind:duration
      on:pause={onPause}
      on:play={onPlay}
    >
      <track
        bind:this={trackEl}
        label="English"
        kind="captions"
        srclang="en"
        src="assets/captions/{name}.vtt"
        default
      />
    </video>

    <button
      aria-label={toggleText}
      class="btn-toggle"
      class:playing
      on:click={onToggle}
      ><Icon name={buttonName} strokeWidth="1px" />
    </button>
  </div>

  <div class="controls">
    <div class="progress">
      <span style:width={widthElapsed} class="elapsed" />
      <span
        style:width={widthCut}
        style:left={leftCut}
        class="cut"
        class:censored>{Math.round(durationCut)}s</span
      >
    </div>
  </div>
</div>
<div>
  <button
    class:censored
    class="btn-censor"
    style:left={leftCut}
    on:click={onCensored}>{censoreText}</button
  >
</div>

<style>
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
    background: red;
    opacity: 0.75;
    transform: translate(-50%, 0);
    transition: all 0.5s ease-in-out;
    text-align: center;
  }

  .cut.censored {
    background: var(--color-bg);
    opacity: 1;
    color: red;
  }

  .cut:before,
  .cut:after {
    display: block;
    position: absolute;
    top: 0;
    line-height: 1;
    font-size: 2rem;
    color: red;
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

  .btn-censor {
    position: absolute;
    top: 0;
    transform: translate(-50%, 50%);
    text-transform: uppercase;
    background-color: red;
    color: white;
  }

  .btn-censor.censored {
    background-color: var(--color-input-bg);
  }

  .btn-toggle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--64px);
    line-height: 1;
    opacity: 0.5;
    background: transparent;
    border-radius: 50%;
    padding: 0;
    text-align: center;
  }

  .btn-toggle:hover {
    opacity: 1;
  }

  .btn-toggle.playing {
    display: none;
  }

  .video-wrapper:hover .btn-toggle.playing {
    display: block;
  }

  :global(.btn-toggle svg) {
    display: block;
  }

  /* WebVTT cues */
  :global(::cue) {
    color: var(--color-white);
    font: normal 2em var(--sans);
  }

  :global(::cue(v[voice="Russell"])) {
    color: #fff;
    background: #0095dd;
  }
</style>
