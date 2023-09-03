import { GameObject } from "$lib/GameObject"
import { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import { MeshUtil } from "$lib/Mesh"
import { initShaderProgram } from "$lib/shaders"
import { get, writable } from "svelte/store"

/**
 * The WebGL context. This is the main entry point for the game's rendering.
 * Set when +page.svelte is mounted.
 */
export const glContext = writable<WebGL2RenderingContext>()
glContext.subscribe(main)

export const glState = writable<GLState>()

export const getGLContext = () => ({
	gl: get(glContext),
	glState: get(glState),
})

//-------------------------------------------------------------------------

export enum Attribute {
	POSITION = "a_vertex",
	COLOR = "a_color",
	// NORMAL = "a_normal",
}

export const BUFFERABLE_ATTRIBUTES = Object.values(Attribute) as Attribute[]

async function main(gl: WebGL2RenderingContext) {
	if (!gl) {
		console.log("No context yet")
		return
	}

	const shaderProgram = await initShaderProgram(gl)
	if (!shaderProgram) {
		throw new Error("Could not create shader program")
	}

	const state = new GLState(gl, shaderProgram)
	glState.set(state)

	const go = new GameObject(gl, { x: 25, y: 25, z: 0 }, MeshUtil.quad(250, 250))

	// render
	requestAnimationFrame(() => renderLoop(gl, state))
}

async function renderLoop(gl: WebGL2RenderingContext, state: GLState) {
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
	await GOManager.draw(gl, state)

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	requestAnimationFrame(() => renderLoop(gl, state))
}
