import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"

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