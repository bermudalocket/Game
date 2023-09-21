import { CanvasUtil } from "$lib/canvas"
import { ColorComponent } from "$lib/components/ColorComponent"
import { MeshComponent } from "$lib/components/MeshComponent"
import { GameObject } from "$lib/GameObject"
import type { GLState } from "$lib/GLState"
import { GOManager } from "$lib/GOManager"
import { MeshUtil } from "$lib/MeshUtil"
import { perf } from "$lib/performance"
import { ShaderType } from "$lib/shaders"
import { get } from "svelte/store"
import { glStateStore } from "../hooks.client"
import onResize = CanvasUtil.onResize
import resizeCanvasToDisplaySize = CanvasUtil.resizeCanvasToDisplaySize

const resizeObserverSizeMap: Map<Element, number[]> = new Map()
let canvasSize = [ 0, 0 ]

export async function main(gl: WebGL2RenderingContext) {
	if (!gl) {
		console.log("No context yet or browser does not support WebGL2")
		return
	}

	const canvas = <HTMLCanvasElement>gl.canvas

	resizeObserverSizeMap.set(canvas, [ 800, 600 ])
	const resizeObserver = new ResizeObserver((entries) => {
		onResize(entries, resizeObserverSizeMap, window.devicePixelRatio)
		canvasSize = resizeObserverSizeMap.get(canvas) || [ 800, 600 ]
	})
	try {
		resizeObserver.observe(canvas, { box: "device-pixel-content-box" })
	} catch (ex) {
		resizeObserver.observe(canvas, { box: "content-box" })
	}

	const go = new GameObject({ x: 25, y: 25 })
	const meshComp = go.addComponent(MeshComponent)
	meshComp.mesh = MeshUtil.quad(250, 250)
	const colorComp = go.addComponent(ColorComponent)
	colorComp.format = "per_vertex"
	colorComp.color = [
		[ 1, 1, 1, 1, ],
		[ 1, 0, 0, 1, ],
		[ 0, 1, 0, 1, ],
		[ 0, 0, 1, 1, ],
	]

	// render
	const glState = get(glStateStore)
	requestAnimationFrame(() => renderLoop(glState))
}

async function renderLoop(state: GLState) {
	perf.start("renderLoop")
	if (resizeCanvasToDisplaySize(<HTMLCanvasElement>gl.canvas, {
		displayWidth: canvasSize[0],
		displayHeight: canvasSize[1]
	}))
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.clearColor(0, 0, 0, 1)

	await GOManager.tick()

	for (const shaderName of Object.values(ShaderType)) {
		const shader = state.getShader(shaderName)
		gl.useProgram(shader.program)
		for (const gameObject of GOManager.gameObjects) {
			for (const [ uniform, uloc ] of Object.entries(shader.uniforms)) {
				switch (uniform) {
					case "u_resolution":
						gl.uniform2f(uloc, gl.canvas.width, gl.canvas.height)
						break
					case "u_translation":
						gl.uniform2f(uloc, gameObject.position.x, gameObject.position.y)
						break
				}
			}
			if (gameObject.getShaderType() === shaderName) {
				await gameObject.draw(state)
			}
		}
	}

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

	requestAnimationFrame(() => renderLoop(state))
	perf.end("renderLoop")
}