import { describe,  test, expect, vi } from "vitest"
import { observe } from "../src/lib/observe"

describe("Observer tests", () => {

	test("Can create an observer", () => {
		const obj = { a: 1, b: "two" }
		const observed = observe(obj)

		expect(observed).has.property("a", 1)
		expect(observed).has.property("b", "two")

		const callback = vi.fn()
		observed.subscribe(callback)
		observed.a = 2

		expect(obj.a).equals(2)
		expect(observed.a).equals(2)
		expect(callback.mock.calls.length).equals(1)
	})

})