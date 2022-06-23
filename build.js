/* eslint-disable @typescript-eslint/no-var-requires */
require('esbuild')
.build({
	platform: 'node',
	format: 'cjs',
	target: 'node14',
	loader: { '.ts': 'ts' },
	entryPoints: ['dist/src/lambda.js'],
	bundle: true,
	outfile: 'out/lambda.js',
	minify: false,
	sourcemap: true,
	external: [
		...require('module').builtinModules,
		'cache-manager',
		'@nestjs/websockets',
		'@nestjs/microservices',
		'fastify-swagger',
		'class-transformer/storage',
		'@nestjs/swagger',
	],
	plugins: [],
})
.catch(() => process.exit(-1));
