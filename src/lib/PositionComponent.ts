import { BaseComponent } from "$lib/BaseComponent"
import type { GLState } from "$lib/GLState"

export class PositionComponent extends BaseComponent {

	public position: Float32Array

	#buffer = new WebGLBuffer()

	public constructor(x: number, y: number, z = 0) {
		super("position")
		this.position = new Float32Array([x, y, z])
	}

	public draw(gl: WebGL2RenderingContext, state: GLState): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer)
		const attr = gl.getAttribLocation(state.program, `a_${this.staticId}`)
		if (attr < 0) {
			gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)
			gl.enableVertexAttribArray(attr)
		}
		gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.STATIC_DRAW)
	}

}
