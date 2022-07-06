<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	import MotionToggle from "$lib/components/helpers/MotionToggle.svelte";
	import { animations } from "$stores/misc.js";
	let value = "off";

	$: $animations = value === "off";
</script>

<p class="warning">
	This story contains scroll-driven visuals.
	<Toggle
		label="View them in
	static format"
		bind:value
	/>
</p>

<div>
	<MotionToggle />
</div>

<style>
	div {
		position: fixed;
		bottom: 16px;
		right: 16px;
		z-index: var(--z-overlay);
		display: flex;
	}

	p {
		background: var(--color-gray-1000);
		font-size: var(--16px);
		padding: 8px;
		text-align: center;
	}
</style>
