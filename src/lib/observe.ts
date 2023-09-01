const _cache = new WeakMap<object, unknown>()

type Callback<T> = (t: T) => void
const _callbacks = new WeakMap<object, Callback<any>[]>()

export type Observed<T extends object> = T & {
	subscribe: (callback: Callback<T>) => void,
	unsubscribe: (callback: Callback<T>) => void,
}

export function observe<T extends object>(obj: T): Observed<T> {
	if (_cache.has(obj)) {
		return _cache.get(obj) as Observed<T>
	}
	const proxy = new Proxy<T>(obj, {
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver)
		},
		set(target, prop, value, receiver): boolean {
			const result = Reflect.set(target, prop, value, receiver)
			const callbacks = _callbacks.get(proxy) as Callback<T>[]
			callbacks?.forEach(callback => callback(proxy))
			return result
		},
	})
	_cache.set(obj, proxy)
	Object.defineProperty(proxy, "subscribe", {
		value: (callback: Callback<T>) => {
			if (_callbacks.has(proxy)) {
				_callbacks.get(proxy)?.push(callback)
			} else {
				_callbacks.set(proxy, [callback])
			}
		}
	})
	Object.defineProperty(proxy, "unsubscribe", {
		value: (callback: Callback<T>) => {
			if (_callbacks.has(proxy)) {
				const callbacks = _callbacks.get(proxy) as Callback<T>[]
				if (!callbacks) {
					return
				}
				const index = callbacks.indexOf(callback)
				if (index !== -1) {
					callbacks.splice(index, 1)
				}
			}
		}
	})
	return proxy as Observed<T>
}
