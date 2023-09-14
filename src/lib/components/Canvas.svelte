<script lang="ts">
    import {browser} from '$app/environment';

    export let canvas: HTMLCanvasElement
</script>

{#if browser}
    <canvas class="w-full h-full" bind:this={canvas} width={window.innerWidth} height={window.innerHeight}/>
{/if}