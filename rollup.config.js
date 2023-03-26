import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import ts from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import path from 'path'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: path.resolve(__dirname, 'dist/log4node.js'),
      format: 'cjs',
      name: 'log4node',
      sourcemap: true
    },
    {
      file: path.resolve(__dirname, 'dist/log4node.min.js'),
      format: 'cjs',
      name: 'log4node',
      plugins: [
        terser({
          sourceMap: true,
        })
      ],
      sourcemap: true
    },
  ],
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"]
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: '**/node_modules/**'
    }),
  ]
}