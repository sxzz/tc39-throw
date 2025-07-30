import { defineConfig } from 'vitest/config'
import Throw from './src/unplugin'

export default defineConfig({
  plugins: [Throw.vite()],
})
