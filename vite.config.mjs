import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import autoprefixer from "autoprefixer"

export default defineConfig({
  base: "./",
  build: {
    outDir: "build",
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({}), // add options if needed
      ],
    },
    preprocessorOptions: {
      scss: {
        // Usar la nueva API de Sass
        api: "modern-compiler", // o 'modern'
        quietDeps: true,
        // Silenciar warnings de deprecación si es necesario temporalmente
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "src/",
        replacement: `${path.resolve(__dirname, "src")}/`,
      },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".scss"],
  },
  server: {
    port: 3000,
    proxy: {
      // https://vitejs.dev/config/server-options.html
    },
  },
})
