export class Performance {

	static readonly #startTimes = new Map<string, number>()

	static readonly #records = new Map<string, Array<number>>()

	private constructor() { }

	public static start(id: string): void {
		this.#startTimes.set(id, performance.now())
	}

	public static end(id: string): void {
		const start = this.#startTimes.get(id)
		if (start === undefined) {
			throw new Error(`No start time recorded for id ${id}`)
		}
		const delta = performance.now() - start
		if (!this.#records.has(id)) {
			this.#records.set(id, [ delta ])
		} else {
			this.#records.get(id)?.push(delta)
		}
		console.log(`Time taken for ${id}: ${delta}ms`)
	}

}