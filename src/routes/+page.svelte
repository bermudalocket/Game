<script lang="ts">
	let canvas: HTMLCanvasElement | undefined

	$: if (canvas) {
		const ctx = canvas.getContext('webgl2')
		if (ctx) {
			ctx.
		}
	}
</script>

<canvas bind:this={canvas} width="500" height="500"></canvas>
