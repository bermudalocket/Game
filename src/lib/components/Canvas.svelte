<script lang="ts">
	import { browser } from '$app/environment';
	export let canvas: HTMLCanvasElement
</script>

{#if browser}
	<canvas bind:this={canvas} width={window.innerWidth} height={window.innerHeight}/>
{/if}