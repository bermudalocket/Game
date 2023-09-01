const _cache = new Map<ShaderType, string>()

const ShaderType = [
	"vertex",
	"frag",
] as const

export type ShaderType = typeof ShaderType[number]

const ShaderData = {
	vertex: {
		glType: 35633, // WebGL2RenderingContext.VERTEX_SHADER,
	},
	frag: {
		glType: 35632, // WebGL2RenderingContext.FRAGMENT_SHADER,
	},
} as const satisfies Record<ShaderType, { glType: number }>

const ShaderTypes = Object.keys(ShaderData) as ShaderType[]

const getShaderSource = async (type: ShaderType) => {
	if (_cache.has(type)) {
		return _cache.get(type)
	}
	const response = await fetch(`/shaders/${type}_shader.glsl`)
	if (!response.ok) {
		throw new Error(`Bad response: ${response.statusText}`)
	}
	const text = await response.text()
	_cache.set(type, text)
	return text
}

export const initShaderProgram = async (gl: WebGL2RenderingContext) => {
	const shaderProgram = gl.createProgram()
	if (!shaderProgram) {
		throw new Error("Could not create shader program")
	}

	for (const type of ShaderTypes) {
		const source = await getShaderSource(type)
		if (!source) {
			throw new Error(`Could not get shader source: ${type}`)
		}
		const shader = loadShader(gl, ShaderData[type].glType, source)
		if (!shader) {
			throw new Error(`Could not load shader: ${type}`)
		}
		gl.attachShader(shaderProgram, shader)
	}

	gl.linkProgram(shaderProgram)
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram))
		return null
	}

	return shaderProgram
}

function loadShader(gl: WebGL2RenderingContext, glType: number, source: string) {
	console.log("Loading shader: ", glType, source)
	const shader = gl.createShader(glType)
	if (!shader) {
		throw new Error("Could not create shader")
	}

	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (success) {
		return shader
	}

	console.log(gl.getShaderInfoLog(shader))
	gl.deleteShader(shader)
}