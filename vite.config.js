import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Vite plugin: auto-regenerate index.json whenever .md files
 * in public/ are added, changed, or removed.
 *
 * This means you NEVER need to run `npm run index` manually.
 * - Dev: rebuilds index on startup + watches for changes
 * - Build: rebuilds index before bundling
 */
function autoIndexPlugin() {
    function rebuild() {
        try {
            execSync('node scripts/build-index.js', {
                cwd: path.resolve(__dirname),
                stdio: 'inherit'
            });
        } catch (e) {
            console.error('⚠ Failed to rebuild index:', e.message);
        }
    }

    return {
        name: 'auto-index',
        buildStart() {
            rebuild();
        },
        configureServer(server) {
            // Watch public/ for .md file changes during dev
            const publicDir = path.resolve(__dirname, 'public');
            server.watcher.add(publicDir);
            server.watcher.on('change', (file) => {
                if (file.endsWith('.md') && file.startsWith(publicDir)) {
                    console.log(`\n📝 ${path.basename(file)} changed → rebuilding index...`);
                    rebuild();
                }
            });
            server.watcher.on('add', (file) => {
                if (file.endsWith('.md') && file.startsWith(publicDir)) {
                    console.log(`\n📝 ${path.basename(file)} added → rebuilding index...`);
                    rebuild();
                }
            });
            server.watcher.on('unlink', (file) => {
                if (file.endsWith('.md') && file.startsWith(publicDir)) {
                    console.log(`\n📝 ${path.basename(file)} removed → rebuilding index...`);
                    rebuild();
                }
            });
        }
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [autoIndexPlugin()],
    base: '/'
}));
