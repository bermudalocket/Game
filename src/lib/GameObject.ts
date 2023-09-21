import type { Component } from "$lib/components/Component"
import { ShaderComponent } from "$lib/components/ShaderComponent"
import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import type { ShaderType } from "$lib/shaders"

export type Vector1 = { x: number }
export type Vector2 = Vector1 & { y: number }
export type Vector3 = Vector2 & { z: number }

export class GameObject implements Disposable {

	readonly #id = crypto.randomUUID()
	public get id(): string { return this.#id }

	readonly #position: Vector2
	public get position(): Vector2 { return this.#position }

	public set position(position: Vector2) {
		this.#position.x = position.x
		this.#position.y = position.y
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

	public getShaderType(): ShaderType | undefined {
		for (const component of this.#components) {
			if (component instanceof ShaderComponent) {
				return component.__shaderType
			}
		}
		return undefined
	}

	public constructor(position: Vector2) {
		this.#position = position
		GOManager.addGameObject(this)
	}

	[Symbol.dispose](): void {
		GOManager.removeGameObject(this)
	}

	public translate(x: number, y: number): void {
		this.#position.x += x
		this.#position.y += y
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
		for (const component of this.#components) {
			component.draw(state)
		}
		return Promise.resolve()
	}

}
