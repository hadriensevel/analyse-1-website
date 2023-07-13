import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: ['js/main.js', 'js/main-semestre.js', 'js/bundle.js', 'js/bundle2.js'],
    output: {
      dir: 'dist/js',
      format: 'es',
      sourcemap: true
    },
    plugins: [resolve({browser: true}), terser({format: {comments: false}})]
  }
]