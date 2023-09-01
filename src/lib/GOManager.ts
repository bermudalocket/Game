import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"

export class GOManager {

	static readonly #gameObjects = new Set<GameObject>()

	static #readyToTick = true
	static #readyToDraw = false

	private constructor() { }

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

	public static draw(gl: WebGL2RenderingContext, state: GLState): void {
		if (!this.#readyToDraw) {
			throw new Error("GOManager is not ready to draw")
		}
		this.#readyToDraw = false
		for (const gameObject of GOManager.#gameObjects) {
			gameObject.draw(gl, state)
		}
		this.#readyToTick = true
	}

}