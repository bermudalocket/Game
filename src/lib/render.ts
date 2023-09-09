import { ColorComponent, GameObject, MeshComponent } from "$lib/GameObject"
import { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import { MeshUtil } from "$lib/Mesh"
import { initShaderProgram } from "$lib/shaders"
import { writable } from "svelte/store"

/**
 * The WebGL context. This is the main entry point for the game's rendering.
 * Set when +page.svelte is mounted.
 */
export const glContext = writable<WebGL2RenderingContext>()
glContext.subscribe(main)

//-------------------------------------------------------------------------

export const Attributes = [
	"a_vertex",
	"a_color",
	"a_normal",
] as const
export type Attribute = typeof Attributes[number]

async function main(gl: WebGL2RenderingContext) {
	if (!gl) {
		console.log("No context yet")
		return
	}

	globalThis.gl = gl

	const shaderProgram = await initShaderProgram()
	if (!shaderProgram) {
		throw new Error("Could not create shader program")
	}

	const state = new GLState(shaderProgram)

	const go = new GameObject({ x: 25, y: 25, z: 0 })
	const meshComp = go.addComponent(MeshComponent)
	meshComp.mesh = MeshUtil.quad(250, 250)
	const colorComp = go.addComponent(ColorComponent)
	colorComp.format = "per_vertex"
	colorComp.color = [
		[ 1, 1, 1, 1, ],
		[ 1, 0, 0, 1, ],
		[ 0, 1, 0, 1, ],
		[ 0, 0, 1, 1, ],
	]

	// render
	requestAnimationFrame(() => renderLoop(state))
}

async function renderLoop(state: GLState) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.clearColor(0, 0, 0, 1)
	gl.clearDepth(1.0)
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.useProgram(state.program)

	gl.uniform2f(gl.getUniformLocation(state.program, "u_resolution"), gl.canvas.width, gl.canvas.height)

	await GOManager.tick()
	await GOManager.draw(state)

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	requestAnimationFrame(() => renderLoop(state))
}
