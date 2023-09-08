import { Attribute, BUFFERABLE_ATTRIBUTES } from "./render"

export enum Uniform {
	RESOLUTION = "u_resolution",
}

export class GLState {

	readonly #program: WebGLProgram

	readonly #attribs: Partial<Record<Attribute, number>> = { }

	readonly #uniforms: Partial<Record<Uniform, WebGLUniformLocation>> = { }

	public constructor(program: WebGLProgram) {
		this.#program = program
		for (const attrib of BUFFERABLE_ATTRIBUTES) {
			this.#attribs[attrib] = gl.getAttribLocation(program, attrib)
		}
	}

	public get program() {
		return this.#program
	}

	public setLoc(prop: Attribute | Uniform, loc: number | WebGLUniformLocation) {
		if (typeof loc === "number") {
			this.#attribs[prop as Attribute] = loc
		} else {
			this.#uniforms[prop as Uniform] = loc
		}
	}

	public loc(prop: Attribute | Uniform): number | WebGLUniformLocation | undefined {
		if (prop in this.#attribs) {
			return this.#attribs[prop as Attribute]
		} else {
			return this.#uniforms[prop as Uniform]
		}
	}

}