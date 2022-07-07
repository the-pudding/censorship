<script>
	import Icon from "$components/helpers/Icon.svelte";
	import SortTable from "$components/helpers/SortTable.svelte";

	export let data = [];
	export let visible;
	export let caption;

	$: rows = data;
	$: columns = Object.keys(data[0]).map((d) => ({ prop: d, label: d }));
</script>

{#if data.length}
	<div class="overlay" class:visible>
		<div class="wrapper">
			<div class="table">
				<SortTable {rows} {columns} {caption} />
			</div>
		</div>
		<button on:click={() => (visible = false)} aria-label="Close"
			><Icon strokeWidth="2px" name="x" /></button
		>
	</div>
{/if}

<style>
	.overlay {
		display: none;
		position: fixed;
		height: 100vh;
		width: 100vw;
		top: 0;
		left: 0;
		z-index: calc(var(--z-overlay) + 1);
		background: var(--color-bg);
	}

	.overlay.visible {
		display: block;
		pointer-events: all;
		overflow: hidden;
	}

	button {
		position: absolute;
		top: 32px;
		right: 16px;
		padding: 0;
		line-height: 1;
		font-size: var(--16px);
		background-color: transparent;
		z-index: var(--z-overlay);
		pointer-events: all;
		color: currentColor;
	}

	.wrapper {
		height: 100%;
		overflow-y: scroll;
		padding: 48px 16px;
	}

	.table {
		max-width: 40rem;
		margin: 0 auto;
	}
</style>
