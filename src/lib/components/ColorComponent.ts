import { MeshComponent } from "$lib/components/MeshComponent"
import { ShaderComponent } from "$lib/components/ShaderComponent"
import type { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"
import type { RGBA } from "$lib/RGBA"
import { ShaderType } from "$lib/shaders"

export type ColorComponentFormat = typeof ColorComponent.FORMAT[keyof typeof ColorComponent.FORMAT]

export class ColorComponent extends ShaderComponent {

	public readonly __shaderType = ShaderType.COLOR

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
		gl.enableVertexAttribArray(state.activeShader.attribs.a_color)
		gl.vertexAttribPointer(state.activeShader.attribs.a_color, 4, gl.FLOAT, false, 0, 0)
	}

	tick(): void {
		// noop
	}

}