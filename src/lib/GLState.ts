export type GLState = {
	program: WebGLProgram,
	attrib: {
		vertexPosition: number,
		vertexColor: number,
	},
	uniformLocations: {
		projectionMatrix: WebGLUniformLocation | null,
		modelViewMatrix: WebGLUniformLocation | null,
		resolution: WebGLUniformLocation | null,
	},
}