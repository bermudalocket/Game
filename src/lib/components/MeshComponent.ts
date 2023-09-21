import { Component } from "$lib/components/Component"
import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"
import type { Mesh } from "$lib/Mesh"

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
		gl.enableVertexAttribArray(state.activeShader.attribs.a_vertex)
		gl.vertexAttribPointer(state.activeShader.attribs.a_vertex, 2, gl.FLOAT, false, 0, 0)
	}

	tick(): void {
		// noop
	}

}