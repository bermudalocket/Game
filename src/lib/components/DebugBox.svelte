<script lang="ts">
	import { getAllContexts, getContext } from "svelte"

	const stuff = getAllContexts()
</script>

<div class="p-4 shadow-xl absolute bottom-4 left-4 rounded-xl">
	{#each stuff as context}
		{JSON.stringify(context)}
	{/each}
</div>
