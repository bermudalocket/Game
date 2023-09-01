import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import type { Mesh } from "$lib/Mesh"
import { getGLContext } from "$lib/render"

export type Vector1 = { x: number }
export type Vector2 = Vector1 & { y: number }
export type Vector3 = Vector2 & { z: number }

export const createBuffer = (data: Float32Array): WebGLBuffer => {
	const { gl } = getGLContext()
	const buffer = gl.createBuffer()
	if (!buffer) {
		throw new Error("Could not create buffer")
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}

export class GameObject implements Disposable {

	readonly #id: string

	readonly #position: Vector3

	readonly #mesh: Mesh
	readonly #meshBuffer: WebGLBuffer
	readonly #colorBuffer: WebGLBuffer

	public constructor(position: Vector3, mesh: Mesh) {
		this.#id = crypto.randomUUID()
		this.#position = position
		this.#mesh = mesh
		GOManager.addGameObject(this)

		this.#meshBuffer = createBuffer(mesh)
		this.#colorBuffer = createBuffer(new Float32Array([
			1, 1, 1, 1,
			1, 0, 0, 1,
			0, 1, 0, 1,
			0, 0, 1, 1,
		]))
	}

	[Symbol.dispose](): void {
		GOManager.removeGameObject(this)
	}

	public get id(): string {
		return this.#id
	}

	public get position(): Vector3 {
		return this.#position
	}

	public set position(position: Vector3) {
		this.#position.x = position.x
		this.#position.y = position.y
		this.#position.z = position.z
	}

	public translate(x: number, y: number, z: number = 0): void {
		this.#position.x += x
		this.#position.y += y
		this.#position.z += z
	}

	//-------------------------------------------------------------------------
	/**
	 * Handles internal logic. Called every frame before {@link draw}.
	 */
	public async tick(): Promise<void> {
	}

	//-------------------------------------------------------------------------
	/**
	 * Handles drawing. Called every frame after {@link tick}.
	 *
	 * @param {WebGL2RenderingContext} gl - The WebGL context
	 * @param {GLState} state - The state of the WebGL context
	 */
	public draw(gl: WebGL2RenderingContext, state: GLState): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#meshBuffer)
		gl.vertexAttribPointer(state.attrib.vertexPosition, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(state.attrib.vertexPosition)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorBuffer)
		gl.vertexAttribPointer(state.attrib.vertexColor, 4, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(state.attrib.vertexColor)
	}

}
