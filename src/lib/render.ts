import { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import { MeshUtil } from "$lib/Mesh"
import { initShaderProgram } from "$lib/shaders"
import { mat4 } from "gl-matrix"
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
	POSITION = "a_position",
	// COLOR = "a_color",
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

	// render
	gl.clearColor(0, 0, 0, 1)
	gl.clearDepth(1.0)
	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	const fov = Math.PI / 4
	const aspect = gl.canvas.width / gl.canvas.height
	const zNear = 0.1
	const zFar = 100.0

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	const projectionMatrix = mat4.create()
	mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar)

	const modelViewMatrix = mat4.create()
	mat4.translate(modelViewMatrix, modelViewMatrix, [ -0.0, 0.0, -6.0 ])

	const state = {
		program: shaderProgram,
		attrib: {
			a_position: gl.getAttribLocation(shaderProgram, "a_position"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
		},
	} satisfies GLState
	glState.set(state)

	// test
	const go = new GameObject(gl, { x: 0, y: 0, z: 0 }, MeshUtil.quad(250, 250))

	gl.useProgram(shaderProgram)
	gl.uniform2f(gl.getUniformLocation(shaderProgram, "u_resolution"), gl.canvas.width, gl.canvas.height)
	gl.uniformMatrix4fv(state.uniformLocations.projectionMatrix, false, projectionMatrix)
	gl.uniformMatrix4fv(state.uniformLocations.modelViewMatrix, false, modelViewMatrix)

	// first render
	await GOManager.tick()
	await GOManager.draw(gl, state)

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	// then start the render loop
	// renderLoop(gl, state)
}
