import type { Attribute } from "./render"

export type GLState = {
	program: WebGLProgram,
	attrib: Record<Attribute, number>,
}
