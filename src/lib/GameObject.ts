import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import type { Mesh } from "$lib/Mesh"

export type Vector1 = { x: number }
export type Vector2 = Vector1 & { y: number }
export type Vector3 = Vector2 & { z: number }

export abstract class Component {

	protected readonly parent: GameObject

	protected readonly buffer: WebGLBuffer

	protected constructor(parent: GameObject) {
		this.parent = parent
		const buffer = gl.createBuffer()
		if (!buffer) {
			throw new Error("Could not create buffer")
		}
		this.buffer = buffer
	}

	public abstract tick(): void

	public abstract draw(state: GLState): void

}

export type RGBA = [ number, number, number, number ]

export class MeshComponent extends Component {

	#mesh!: Mesh
	public set mesh(mesh: Mesh) { this.#mesh = mesh }

	public get vertices(): number {
		return this.#mesh.length / 2
	}

	constructor(parent: GameObject) {
		super(parent)
	}

	draw(state: GLState): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		gl.bufferData(gl.ARRAY_BUFFER, this.#mesh, gl.STATIC_DRAW)
		gl.enableVertexAttribArray(state.attribs.a_vertex)
		gl.vertexAttribPointer(state.attribs.a_vertex, 2, gl.FLOAT, false, 0, 0)
	}

	tick(): void {
		// noop
	}

}

export type ColorComponentFormat = typeof ColorComponent.FORMAT[keyof typeof ColorComponent.FORMAT]

export class ColorComponent extends Component {

	public static readonly FORMAT = [ "repeat", "per_vertex", ] as const

	#format!: ColorComponentFormat

	public set format(format: ColorComponentFormat) {
		this.#format = format
	}

	#color!: RGBA | Array<RGBA>

	public set color(color: RGBA | Array<RGBA>) {
		this.#color = color
	}

	protected readonly buffer: WebGLBuffer

	constructor(parent: GameObject) {
		super(parent)
		const buffer = gl.createBuffer()
		if (!buffer) {
			throw new Error("Could not create buffer for color component")
		}
		this.buffer = buffer
	}

	draw(state: GLState): void {
		if (!this.#color) throw new Error("Color not set")
		if (!this.#format) throw new Error("Color format not set")
		const meshComponent = this.parent.getComponent(MeshComponent)
		if (!meshComponent) throw new Error("Could not find mesh component")
		const data = new Float32Array(4 * meshComponent.vertices)
		switch (this.#format) {
			case "repeat":
				for (let i = 0; i < meshComponent.vertices; i++) {
					data[4 * i] = this.#color[0] as number
					data[4 * i + 1] = this.#color[1] as number
					data[4 * i + 2] = this.#color[2] as number
					data[4 * i + 3] = this.#color[3] as number
				}
				break

			case "per_vertex":
				for (let i = 0; i < meshComponent.vertices; i++) {
					data[4 * i] = (this.#color[i] as RGBA)[0]
					data[4 * i + 1] = (this.#color[i] as RGBA)[1]
					data[4 * i + 2] = (this.#color[i] as RGBA)[2]
					data[4 * i + 3] = (this.#color[i] as RGBA)[3]
				}
				break
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1, 1, 1, 1,
			1, 0, 0, 1,
			0, 1, 0, 1,
			0, 0, 1, 1,
		]), gl.STATIC_DRAW)
		gl.enableVertexAttribArray(state.attribs.a_color)
		gl.vertexAttribPointer(state.attribs.a_color, 4, gl.FLOAT, false, 0, 0)
	}

	tick(): void {
		// noop
	}

}

export class GameObject implements Disposable {

	readonly #id = crypto.randomUUID()
	public get id(): string { return this.#id }

	readonly #position: Vector3
	public get position(): Vector3 { return this.#position }

	public set position(position: Vector3) {
		this.#position.x = position.x
		this.#position.y = position.y
		this.#position.z = position.z
	}

	readonly #components = new Set<Component>()
	public get components(): ReadonlySet<Component> { return this.#components }

	public addComponent<T extends Component>(type: { new(parent: GameObject, ...args: never[]): T }) {
		const component = new type(this)
		this.#components.add(component)
		return component
	}

	public getComponent<T extends Component>(type: { new(...args: never[]): T }): T | null {
		for (const component of this.#components) {
			if (component instanceof type) {
				return component as T
			}
		}
		return null
	}

	public constructor(position: Vector3) {
		this.#position = position
		GOManager.addGameObject(this)
	}

	[Symbol.dispose](): void {
		GOManager.removeGameObject(this)
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
	 * @param state The current GL state
	 * @returns A promise that resolves when drawing is complete
	 */
	public async draw(state: GLState) {
		gl.uniform2f(gl.getUniformLocation(state.program, "u_translation"), this.position.x, this.position.y)
		for (const component of this.#components) {
			component.draw(state)
		}
		return Promise.resolve()
	}

}
