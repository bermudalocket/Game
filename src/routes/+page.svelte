<script lang="ts">
	import Canvas from "$lib/components/Canvas.svelte"
	import { glContext } from "$lib/render"

	let canvas: HTMLCanvasElement

	$: if (canvas) {
		const ctx = canvas.getContext('webgl2')
		if (ctx) {
			console.log("Setting context: ", ctx)
			glContext.set(ctx)
		}
	}
</script>

<Canvas bind:canvas />
