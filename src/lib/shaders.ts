export const Attributes = [
	"a_vertex",
	"a_color",
	"a_normal",
] as const
export type Attribute = typeof Attributes[number]

export const Uniforms = [
	"u_resolution",
	"u_translation",
] as const
export type Uniform = typeof Uniforms[number]

interface IShader {
	readonly type: |
		WebGL2RenderingContext["VERTEX_SHADER"] |
		WebGL2RenderingContext["FRAGMENT_SHADER"]
	readonly source: string
}

interface IVertexShader extends IShader {
	readonly type: WebGL2RenderingContext["VERTEX_SHADER"]
}

interface IFragmentShader extends IShader {
	readonly type: WebGL2RenderingContext["FRAGMENT_SHADER"]
}

type ShaderCompilationData = {
	readonly vertex: IVertexShader,
	readonly frag: IFragmentShader,
}

export type ShaderWrapper = {
	readonly program: WebGLProgram,
	readonly attribs: Record<Attribute, number>,
	readonly uniforms: Record<Uniform, WebGLUniformLocation>,
}

export enum ShaderType {
	COLOR = "color",
	TEXTURE = "texture",
}

export namespace ShaderUtil {
	export function bootstrap() {
		return _bootstrap()
	}
}

async function _bootstrap() {
	const shaders = {} as Record<ShaderType, ShaderWrapper>
	const fetchSource = async (type: ShaderType) => {
		return Promise.all([
			fetch(`http://localhost:5173/shaders/vertex_${type}.glsl`).then(res => res.text()),
			fetch(`http://localhost:5173/shaders/frag_${type}.glsl`).then(res => res.text()),
		]).then(([ vs, fs ]) => [ vs, fs ])
	}
	for (const name of Object.values(ShaderType)) {
		const [ vs, fs ] = await fetchSource(name)
		const data = {
			vertex: { type: gl.VERTEX_SHADER, source: vs },
			frag: { type: gl.FRAGMENT_SHADER, source: fs },
		}
		const shader = createShaderWrapper(data)
		if (!shader) {
			throw new Error(`Could not create shader program for ${name}`)
		}
		shaders[name] = shader
	}
	return shaders
}

function createShaderWrapper(data: ShaderCompilationData): ShaderWrapper {
	const program = gl.createProgram()
	if (!program) {
		throw new Error("Could not create shader program")
	}

	const compileShader = <T extends IShader>(shader: T): WebGLShader => {
		const glShader = gl.createShader(shader.type)
		if (!glShader) {
			throw new Error(`Could not create shader (type = ${shader.type})`)
		}
		gl.shaderSource(glShader, shader.source)
		gl.compileShader(glShader)
		if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
			throw new Error(`Could not compile shader: ${gl.getShaderInfoLog(glShader)}`)
		}
		return glShader
	}

	const vertexShader = compileShader(data.vertex)
	const fragShader = compileShader(data.frag)
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(program))
		return null as never
	}
	gl.useProgram(program)
	const attribs = {} as Record<Attribute, number>
	for (const attrib of Attributes) {
		attribs[attrib] = gl.getAttribLocation(program, attrib)
	}
	const uniforms = {} as Record<Uniform, WebGLUniformLocation>
	for (const uniform of Uniforms) {
		const loc = gl.getUniformLocation(program, uniform)
		if (!loc) {
			throw new Error(`Could not find location for uniform ${uniform}`)
		}
		uniforms[uniform] = loc
	}
	gl.useProgram(null)
	return { program, attribs, uniforms }
}
