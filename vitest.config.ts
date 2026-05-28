import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

interface PackageJson {
  version: string
}

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as PackageJson

export default defineConfig({
  define: {
    __LEADPUSH_SDK_VERSION__: JSON.stringify(packageJson.version),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})
