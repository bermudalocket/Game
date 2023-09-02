import { getGLContext } from "$lib/render"

export const createBuffer = (data: Float32Array): WebGLBuffer => {
	const { gl } = getGLContext()
	const buffer = gl.createBuffer()
	if (!buffer) {
		throw new Error("Could not create buffer")
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}
