<script lang="ts">
	import { canvasStore } from "../hooks.client"
	import Canvas from "./Canvas.svelte"

	let canvas: HTMLCanvasElement

	$: if (canvas) {
		canvasStore.set(canvas)
	}
</script>

<Canvas bind:canvas/>
