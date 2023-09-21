import { ShaderType, type ShaderWrapper } from "$lib/shaders"

export class GLState {

	readonly #shaders: Record<ShaderType, ShaderWrapper>

	#activeShader: ShaderType = ShaderType.COLOR

	public constructor(shaders: Record<ShaderType, ShaderWrapper>) {
		this.#shaders = shaders
	}

	public get activeShader(): ShaderWrapper {
		return this.#shaders[this.#activeShader]
	}

	public set activeShader(value: ShaderType) {
		this.#activeShader = value
	}

	public getShader(type: ShaderType) {
		return this.#shaders[type]
	}

	public getShaderAndSetActive(type: ShaderType) {
		this.activeShader = type
		return this.getShader(type)
	}

}