import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'js/main.js',
    output: {
      file: 'dist/js/main.min.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [terser()]
  },
  {
    input: 'js/main-semestre.js',
    output: {
      file: 'dist/js/main-semestre.min.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [terser()]
  },
  {
    input: 'js/bundle.js',
    output: {
      file: 'dist/js/bundle.min.js',
      format: 'cjs',
    },
    plugins: [terser({format: {comments: false}})]
  },
  {
    input: 'js/bundle2.js',
    output: {
      file: 'dist/js/bundle2.min.js',
      format: 'cjs',
    },
    plugins: [terser({format: {comments: false}})]
  },
]