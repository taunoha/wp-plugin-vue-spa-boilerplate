import path from 'path';
import { fileURLToPath, URL } from 'url';

import { unheadVueComposablesImports } from '@unhead/vue';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import gettextExtractorForWordpress from './vite-plugins/gettext-extractor-for-wordpress.js';
import prepareHMR from './vite-plugins/prepare-hmr.js';

const filename = '{plugin-shortcode}';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', unheadVueComposablesImports],
      dirs: [
        './src/utils/**',
        './src/composables/**',
      ],
      vueTemplate: true,
    }),
    Components({
      deep: true,
      directoryAsNamespace: true,
    }),
    gettextExtractorForWordpress({
      path: path.resolve(__dirname, 'languages/'),
      context: '',
      domain: '{plugin-shortcode}'
    }),
    prepareHMR(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      name: '{plugin}',
      entry: path.resolve(__dirname, `src/main.js`),
      formats: ['es'],
      fileName: () => `${filename}.js`
    },
    rollupOptions: {
      output: {
        extend: true,
        assetFileNames: (assetInfo) => {
          if( assetInfo.name == 'style.css') {
            return `${filename}.css`;
          }
          return assetInfo.name;
        },
      }
    }
  }
});
