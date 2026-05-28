import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(readFileSync(resolve(rootDirectory, 'package.json'), 'utf8'))

function injectPackageVersion(version) {
  return {
    name: 'inject-package-version',
    transform(code) {
      if (!code.includes('__LEADPUSH_SDK_VERSION__')) {
        return null
      }

      return {
        code: code.replaceAll('__LEADPUSH_SDK_VERSION__', JSON.stringify(version)),
        map: null,
      }
    },
  }
}

export default {
  input: '.rollup/index.js',
  external: [/^node:/],
  plugins: [
    injectPackageVersion(packageJson.version),
  ],
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
  ],
}
