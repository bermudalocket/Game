<script lang="ts">
	import { browser } from '$app/environment';
	export let canvas: HTMLCanvasElement
</script>

{#if browser}
	<canvas bind:this={canvas} width={screen.availWidth} height={screen.availHeight}/>
{/if}