<script lang="ts">
	import "../app.css"

	import DebugBox from "$lib/components/DebugBox.svelte"
	import { setContext } from "svelte"
	import { writable } from "svelte/store"

	setContext("canvas", writable<HTMLCanvasElement>())
</script>

<DebugBox />
<slot />
