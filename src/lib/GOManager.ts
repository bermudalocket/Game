import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"

export class GOManager {

	static readonly #gameObjects = new Set<GameObject>()

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
		for (const gameObject of GOManager.#gameObjects) {
			await gameObject.tick()
		}
	}

	public static async draw(state: GLState) {
		for (const gameObject of GOManager.#gameObjects) {
			await gameObject.draw(state)
		}
	}

}