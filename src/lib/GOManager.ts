import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"

export class GOManager {

	static readonly #gameObjects = new Set<GameObject>()

	static #readyToTick = true
	static #readyToDraw = false

	private constructor() {
		// noop
	}

	public static get gameObjects(): ReadonlySet<GameObject> {
		return this.#gameObjects
	}

	public static addGameObject(gameObject: GameObject): void {
		this.#gameObjects.add(gameObject)
	}

	public static removeGameObject(gameObject: GameObject): void {
		this.#gameObjects.delete(gameObject)
	}

	static #ticks = 0

	public static async tick() {
		if (!this.#readyToTick) {
			throw new Error("GOManager is not ready to tick")
		}
		this.#readyToTick = false
		this.#readyToDraw = false
		for (const gameObject of GOManager.#gameObjects) {
			await gameObject.tick()
		}
		this.#readyToDraw = true
	}

	public static async draw(state: GLState) {
		if (!this.#readyToDraw) {
			throw new Error("GOManager is not ready to draw")
		}
		this.#readyToDraw = false
		for (const gameObject of GOManager.#gameObjects) {
			await gameObject.draw(state)
		}
		this.#readyToTick = true
	}

}