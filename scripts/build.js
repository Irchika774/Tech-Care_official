import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve, normalize } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runBuild() {
  try {
    // Use pathToFileURL to properly handle Windows paths
    const indexPath = normalize(resolve(__dirname, 'index.html'));
    const indexUrl = pathToFileURL(indexPath).href;
    
    console.log('Root:', __dirname);
    console.log('Index:', indexUrl);
    
    await build({
      root: __dirname,
      plugins: [react()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: indexUrl,
        },
      },
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
