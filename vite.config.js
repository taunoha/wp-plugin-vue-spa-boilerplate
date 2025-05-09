import path from 'path';
import { fileURLToPath, URL } from 'url';
import replace from '@rollup/plugin-replace';

import { unheadVueComposablesImports } from '@unhead/vue';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite';
import gettextExtractorForWordpress from './vite-plugins/gettext-extractor-for-wordpress.js';
import prepareHMR from './vite-plugins/prepare-hmr.js';

const filename = '{plugin-shortcode}';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = { ...process.env };
  return {
    define: {
      'process.env': env
    },
    plugins: [
      VueRouter(),
      vue(),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          'vue-router',
          unheadVueComposablesImports
        ],
        dirs: [
          './app/utils/**',
          './app/composables/**',
        ],
        vueTemplate: true,
        eslintrc: {
          enabled: true,
        },
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
        '@': fileURLToPath(new URL('./app', import.meta.url))
      }
    },
    server: {
      cors: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    build: {
      lib: {
        name: '{plugin}',
        entry: path.resolve(__dirname, `app/main.js`),
        formats: ['es'],
        fileName: filename
      },
      rollupOptions: {
        plugins: [
          replace({
            preventAssignment: true,
            delimiters: ['', ''],
            include: 'app/**/*.vue',
            values: {
              [process.cwd()]: '',
              [__dirname]: '',
            },
          })
        ],
        output: {
          extend: true,
        }
      }
    }
  }
});
