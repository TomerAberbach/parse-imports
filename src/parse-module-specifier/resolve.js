import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const require = createRequire(import.meta.url)

const resolve = (from, to) => {
  try {
    return require.resolve(to, { paths: [dirname(from)] })
  } catch {
    return undefined
  }
}

export default resolve
