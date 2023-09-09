import { type Attribute, Attributes } from "./render"

export const Uniforms = [
	"u_resolution",
] as const
export type Uniform = typeof Uniforms[number]

export class GLState {

	readonly #program: WebGLProgram
	public get program() { return this.#program }

	readonly #attribs = {} as Record<Attribute, number>
	public get attribs() { return this.#attribs }

	readonly #uniforms = {} as Record<Uniform, WebGLUniformLocation>
	public get uniforms() { return this.#uniforms }

	public constructor(program: WebGLProgram) {
		this.#program = program
		for (const attrib of Attributes) {
			this.#attribs[attrib] = gl.getAttribLocation(program, attrib)
		}
		for (const uniform of Uniforms) {
			const loc = gl.getUniformLocation(program, uniform)
			if (!loc) throw new Error(`Could not find location for uniform ${uniform}`)
			this.#uniforms[uniform] = loc
		}
	}

}