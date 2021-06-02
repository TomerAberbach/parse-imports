import { expectType } from 'tsd'
import parseImports, { Import } from '../src'

expectType<Promise<Iterable<Import>>>(parseImports('some code'))
expectType<Promise<Iterable<Import>>>(parseImports('some code', {}))
expectType<Promise<Iterable<Import>>>(
  parseImports('some code', { resolveFrom: './wow' })
)
