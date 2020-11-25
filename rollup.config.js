/* eslint-disable
	import/no-default-export
--
rollup wants it
*/

import html from '@rollup/plugin-html';
import typescript from '@rollup/plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import size from 'rollup-plugin-size';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const output = {
	format: 'iife',

	// wrap output in a try/catch so we can ignore any errors completely
	intro: 'try {',
	outro: '}catch(e){console.error(e)}',
};

export default {
	input: './src/index.ts',
	output: [
		{
			file: pkg.main,
			plugins: [
				!process.env.ROLLUP_WATCH && terser(),
				!process.env.ROLLUP_WATCH && size(),
			],
			...output,
		},
		{
			file: pkg.source,
			plugins: [
				html({ template: require('./demo-page.js') }),
				process.env.ROLLUP_WATCH && serve('dist'),
				process.env.ROLLUP_WATCH && livereload({ watch: 'dist' }),
			],
			...output,
		},
	],

	plugins: [typescript()],
};
