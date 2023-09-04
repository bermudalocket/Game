import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'glsl-hmr',
			enforce: 'post',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.glsl')) {
					server.ws.send({
						type: 'full-reload',
						path: '*'
					});
				}
			}
		},
	],
	test: {
		include: ['test/**/*.{test,spec}.{js,ts}']
	}
});
