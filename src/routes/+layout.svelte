<script lang="ts">
	import { setContext } from "svelte"
	import { writable } from "svelte/store"
	import "../app.css"

	import DebugBox from "./DebugBox.svelte"

	setContext("canvas", writable<HTMLCanvasElement>())
</script>

<DebugBox/>
<slot/>
