export namespace perf {

	const _startTimes = new Map<string, number>()

	const _history = new Map<string, number[]>()

	const _stats = (id: string): { mean: number, stdev: number } => {
		const history = _history.get(id)
		if (!history) {
			throw new Error(`No history recorded for id ${id}`)
		}
		const mean = history.reduce((acc, cur) => acc + cur, 0) / history.length
		const stdev = Math.sqrt(history.reduce((acc, cur) => acc + (cur - mean) ** 2, 0) / history.length)
		return { mean, stdev }
	}

	export function start(id: string): void {
		_startTimes.set(id, performance.now())
	}

	export function end(id: string): void {
		const start = _startTimes.get(id)
		if (start === undefined) {
			throw new Error(`No start time recorded for id ${id}`)
		}
		const delta = performance.now() - start
		const history = _history.get(id)
		if (!history) {
			_history.set(id, [ delta ])
		} else {
			history.push(delta)
		}
		const stats = _stats(id)
		if (Math.random() < 0.01) {
			console.log(`Time taken for %s: %.2fms (avg: %.2fms | stdev: %.2fms)`, id, delta, stats.mean, stats.stdev)
		}
	}
}
