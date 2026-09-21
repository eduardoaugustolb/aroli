import { mkdir, copyFile } from 'node:fs/promises';

// Original versioned binaries keep deployment builds independent of font services.
const source = new URL('../../fonts/aroli-sans/dist/', import.meta.url);
const target = new URL('../app/fonts/', import.meta.url);
await mkdir(target, { recursive: true });
for (const style of ['Regular', 'Medium', 'SemiBold', 'Bold']) {
  const file = `AroliSans-${style}.woff2`;
  await copyFile(new URL(file, source), new URL(file, target));
}
console.log('Aroli Sans: four local weights ready. No font download required.');
