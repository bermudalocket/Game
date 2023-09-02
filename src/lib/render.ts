import { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import { MeshUtil } from "$lib/Mesh"
import { initShaderProgram } from "$lib/shaders"
import { mat4 } from "gl-matrix"
import { get, type Readable, type Writable, writable } from "svelte/store"

/**
 * The WebGL context. This is the main entry point for the game's rendering.
 * Set when +page.svelte is mounted.
 */
export const glContext = writable<WebGL2RenderingContext>()
glContext.subscribe(main)

export type StoredType<T> = T extends Writable<infer R> ? R : (T extends Readable<infer R> ? R : never)

export const glState = writable<GLState>()

export const getGLContext = () => ({
	gl: get(glContext),
	glState: get(glState),
})

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

	const projectionMatrix = mat4.create()
	mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar)

	const modelViewMatrix = mat4.create()
	mat4.translate(modelViewMatrix, modelViewMatrix, [ -0.0, 0.0, -6.0 ])

	console.log("shaderProgram = ", shaderProgram)
	const state: GLState = {
		program: shaderProgram,
		attrib: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
			resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
		},
	}
	glState.set(state)

	// test
	const go = new GameObject({ x: 0, y: 0, z: 0 }, MeshUtil.quad(1, 1))


	// first render
	await GOManager.tick()
	GOManager.draw(gl, state)

	// then start the render loop
	// renderLoop(gl, state)
	
	gl.useProgram(shaderProgram)
	gl.uniformMatrix4fv(state.uniformLocations.projectionMatrix, false, projectionMatrix)
	gl.uniformMatrix4fv(state.uniformLocations.modelViewMatrix, false, modelViewMatrix)
	gl.uniform2fv(state.uniformLocations.resolution, [gl.canvas.width, gl.canvas.width])

	const offset = 0
	const vertexCount = 4
	gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
}

async function renderLoop(gl: WebGL2RenderingContext, glState: GLState) {
	while (true) {
		await GOManager.tick()
		GOManager.draw(gl, glState)
		await new Promise(r => setTimeout(r, 1000 / 60))
	}
}