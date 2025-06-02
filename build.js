// build.js
const esbuild = require('esbuild');
const fs = require('fs');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/bundle.js',
}).then(() => {
  fs.copyFileSync('index.html', 'dist/index.html');
  fs.copyFileSync('src/style.css', 'dist/style.css');
  console.log('Build complete!');
}).catch(() => process.exit(1));
