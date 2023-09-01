import type { GLState } from "$lib/GLState"

export abstract class BaseComponent {

	public readonly id = crypto.randomUUID()

	protected constructor(
		readonly staticId: string,
		readonly unique = true,
	) { }

	abstract draw(gl: WebGL2RenderingContext, state: GLState): void

}
