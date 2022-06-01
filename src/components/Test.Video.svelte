<script>
  import { tick } from "svelte";
  import { scaleLinear } from "d3";
  import Icon from "$components/helpers/Icon.svelte";
  const start = 4.1;
  const end = 9.4;
  const durationCut = end - start;
  const mid = durationCut / 2 + start;
  const scaleBefore = scaleLinear().domain([0, start]).range([0, mid]);
  const scaleAfter = scaleLinear();

  let el;
  let duration;
  let currentTime = 0;
  let paused = true;
  let censored = true;
  let jumped = false;
  let autoplay = false;

  const onCensored = () => {
    paused = true;
    el.pause();
    el.currentTime = 0;
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
    if (paused) el.play();
    else el.pause();
  };

  const toPercent = (a, b = 1) => `${(a / b) * 100}%`;

  $: buttonName = paused ? "play-circle" : "pause-circle";
  $: scaleAfter.domain([end, duration]).range([mid, duration]);

  $: jumped = currentTime === 0 ? false : jumped;

  $: censoreText = censored ? "View original" : "View censored";
  $: toggleText = paused ? "Play video" : "Pause video";

  $: progress =
    censored && jumped
      ? scaleAfter(currentTime)
      : censored && !jumped
      ? scaleBefore(currentTime)
      : currentTime || 0;

  $: leftCut = toPercent(mid, duration);
  $: widthCut = censored ? "2rem" : toPercent(durationCut, duration);
  $: widthElapsed = toPercent(progress, duration);

  $: if (censored && !jumped && !paused && currentTime > start) {
    jumped = true;
    el.currentTime = end;
  }

  $: if (autoplay && currentTime === 0 && paused) {
    autoplay = false;
    el.play();
  }

  $: playing = !paused;
</script>

<div>
  <div class="video-wrapper">
    <video
      bind:this={el}
      src="assets/clips/a93_full.mp4"
      bind:currentTime
      bind:duration
      on:pause={onPause}
      on:play={onPlay}
    >
      <track kind="captions" />
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
</style>
