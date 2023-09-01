export type Mesh = Float32Array

export namespace MeshUtil {

	export function quad(w: number, h: number) {
		return new Float32Array([
			0, 0,
			0, h,
			w, 0,
			w, h,
		])
	}

	export function circle(radius: number, segments: number) {
		const vertices: number[] = []
		for (let i = 0; i < segments; i++) {
			const angle = 2 * Math.PI * i / segments
			vertices.push(
				radius * Math.cos(angle),
				radius * Math.sin(angle),
			)
		}
		return new Float32Array(vertices)
	}

	export function triangle(w: number, h: number) {
		return new Float32Array([
			0, 0,
			w, 0,
			0, h,
		])
	}

	export function star(radius: number) {
		return new Float32Array([
			0, 0,
			0, radius,
			radius, 0,
			radius, radius,
			radius / 2, radius / 2,
		])
	}

	export function cuboid(l: number, w: number, h: number) {
		return new Float32Array([
			0, 0, 0,
			0, 0, h,
			0, w, 0,
			0, w, h,
			l, 0, 0,
			l, 0, h,
			l, w, 0,
			l, w, h,
		])
	}

}