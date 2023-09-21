import { browser } from "$app/environment"
import { GLState } from "$lib/GLState"
import { main } from "$lib/render"
import { ShaderUtil } from "$lib/shaders"
import { writable } from "svelte/store"

console.log("hooks.client.ts fired")
if (!browser) {
	throw new Error("No document")
}

export const canvasStore = writable<HTMLCanvasElement>()
export const glStateStore = writable<GLState>()

canvasStore.subscribe(console.log)
glStateStore.subscribe(console.log)

canvasStore.subscribe(async canvas => {
	if (!canvas) {
		return
	}
	const context = canvas?.getContext("webgl2")
	if (!context) {
		throw new Error("Could not get WebGL2 context")
	}
	globalThis.gl = context

	const shaders = await ShaderUtil.bootstrap()
	glStateStore.set(new GLState(shaders))

	await main(gl)
})
