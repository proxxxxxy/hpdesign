import { mkdir, copyFile, cp, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js', 'media-controller.js', 'site.config.js', 'favicon.svg']) {
  await copyFile(resolve(root, file), resolve(output, file));
}
await access(resolve(root, 'assets/architecture.webp'));
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
console.log('Build complete: dist/index.html');
