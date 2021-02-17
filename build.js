const esbuild = require('esbuild');
const pkg = require('./package.json');

esbuild.buildSync({
  entryPoints: ['src/embed.ts'],
  bundle: true,
  sourcemap: true,
  format: 'esm',
  outfile: 'build/vega-embed.module.js',
  external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
});

const external = ['vega', 'vega-lite'];

for (const build of ['es5', 'es6']) {
  const buildFolder = build === 'es5' ? 'build-es5' : 'build';

  esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    format: 'iife',
    globalName: 'vegaEmbed',
    target: build === 'es5' ? 'es2020' : 'es2015',
    external,
    outfile: `${buildFolder}/vega-embed.js`,
  });

  esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: 'iife',
    globalName: 'vegaEmbed',
    target: build === 'es5' ? 'es2020' : 'es2015',
    external,
    outfile: `${buildFolder}/vega-embed.min.js`,
  });
}
