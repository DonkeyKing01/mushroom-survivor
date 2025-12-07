import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 显式设置 esbuild 和 build 的目标为 es2020，以支持 import.meta.env 语法
  esbuild: {
    target: "es2020"
  },
  build: {
    target: "es2020"
  }
})