import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'js/bundle.js',
    output: {
      file: 'dist/js/bundle.min.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [terser()]
  },
  {
    input: 'js/bundle2.js',
    output: {
      file: 'dist/js/bundle2.min.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [terser()]
  },
]