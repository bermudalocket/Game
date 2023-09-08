import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import type { Mesh } from "$lib/Mesh"
import { Attribute, BUFFERABLE_ATTRIBUTES } from "$lib/render"

export type Vector1 = { x: number }
export type Vector2 = Vector1 & { y: number }
export type Vector3 = Vector2 & { z: number }

export class GameObject implements Disposable {

	readonly #id: string
	readonly #position: Vector3
	readonly #rotation: number = 0
	readonly #buffers = new Map<Attribute, WebGLBuffer>()
	readonly #mesh: Mesh
	readonly #texture: WebGLTexture | null

	public constructor(position: Vector3, mesh: Mesh, texture: WebGLTexture | null = null) {
		this.#id = crypto.randomUUID()
		this.#position = position
		this.#mesh = mesh
		this.#texture = texture
		this.#buffers = new Map()

		for (const prop of BUFFERABLE_ATTRIBUTES) {
			const buffer = gl.createBuffer()
			if (!buffer) {
				throw new Error("Could not create buffer")
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, this.#dataForAttribute(prop).data, gl.STATIC_DRAW)
			this.#buffers.set(prop, buffer)
		}
		GOManager.addGameObject(this)
	}

	#dataForAttribute(attr: Attribute): { data: Float32Array, size: number } {
		if (attr === Attribute.POSITION) {
			return { data: this.#mesh, size: 2 }
		} else if (attr === Attribute.COLOR) {
			return { data: new Float32Array([
				1, 1, 1, 1,
				1, 0, 0, 1,
				0, 1, 0, 1,
				0, 0, 1, 1,
			]), size: 4 }
		}
		throw new Error(`Could not find data for attribute ${attr}`)
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

	public translate(x: number, y: number, z = 0): void {
		this.#position.x += x
		this.#position.y += y
		this.#position.z += z
	}

	//-------------------------------------------------------------------------
	/**
	 * Handles internal logic. Called every frame before {@link draw}.
	 * 
	 * @returns A promise that resolves when logic is complete
	 */
	public async tick() {
		return Promise.resolve()
	}

	//-------------------------------------------------------------------------
	/**
	 * Handles drawing. Called every frame after {@link tick}.
	 *
	 * @param gl - The WebGL context
	 * @returns A promise that resolves when drawing is complete
	 */
	public async draw(gl: WebGL2RenderingContext, state: GLState) {
		gl.uniform2f(gl.getUniformLocation(state.program, "u_translation"), this.position.x, this.position.y)

		for (const prop of BUFFERABLE_ATTRIBUTES) {
			const buffer = this.#buffers.get(prop)
			if (!buffer) {
				return Promise.reject(`Could not find buffer for ${prop}`)
			}
			const location = state.loc(prop) as number
			if (location === -1) {
				// check: is it being optimized out of the shader code?
				return Promise.reject(`Could not find location for ${prop}`)
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, this.#dataForAttribute(prop).data, gl.STATIC_DRAW)
			gl.enableVertexAttribArray(location)
			gl.vertexAttribPointer(location, this.#dataForAttribute(prop).size, gl.FLOAT, false, 0, 0)
		}
		return Promise.resolve()
	}

}
