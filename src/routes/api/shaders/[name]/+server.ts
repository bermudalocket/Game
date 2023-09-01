import type { RequestEvent } from "./$types"

export async function GET(event: RequestEvent) {
	const res = await event.fetch(`/shaders/${event.params.name}.glsl`)
	const data = await res.text()
	const body = JSON.stringify(res.ok ? data : { "err": res.statusText })
	return new Response(body, {
		status: res.status,
		headers: {
			"Content-Type": "text/plain",
		},
	})
}
