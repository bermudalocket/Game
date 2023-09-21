import { Component } from "$lib/components/Component"
import type { ShaderType } from "$lib/shaders"

export abstract class ShaderComponent extends Component {
	public abstract readonly __shaderType: ShaderType
}
