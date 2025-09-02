import { defineConfig } from 'tsdown/config'

export default defineConfig([
  {
    entry: `src/index.js`,
    platform: `node`,
    sourcemap: `inline`,
    dts: false,
    publint: true,
  },
  {
    entry: `src/index.d.ts`,
    dts: { emitDtsOnly: true },
  },
])
