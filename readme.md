<h1 align="center">
  parse-imports
</h1>

<div align="center">
  <a href="https://npmjs.org/package/parse-imports">
    <img src="https://badgen.now.sh/npm/v/parse-imports" alt="version" />
  </a>
  <a href="https://github.com/TomerAberbach/parse-imports/actions">
    <img src="https://github.com/TomerAberbach/parse-imports/workflows/CI/badge.svg" alt="CI" />
  </a>
</div>

<div align="center">
  A blazing fast ES module imports parser.
</div>

## Features

- Uses the superb WASM-based
  [`es-module-lexer`](https://github.com/guybedford/es-module-lexer) under the
  hood
- Identifies module specifier types (e.g. relative file import, package import,
  builtin import, etc.)
- Unescapes module specifier escape sequences
- Collects default, named, and namespace imports
- Works with dynamic imports
- Resolves module specifier paths via `require.resolve`

## Install

```sh
$ npm i parse-imports
```

## Usage

```js
import parseImports from 'parse-imports'

const code = `
  import a from 'b'
  import * as c from './d'
  import { e as f, g as h, i } from '/j'
  import k, { l as m } from 'n'
  import o, * as p from "./q"
  import r, { s as t, u } from "/v"
  import fs from 'fs'

  ;(async () => {
    await import("w")
    await import("x" + "y")
  })()
`

// Lazily iterate over iterable of imports
for (const $import of await parseImports(code)) {
  console.log($import)
}

// Or get as an array of imports
const imports = [...(await parseImports(code))]

console.log(imports[0])
//=>
// {
//   startIndex: 3,
//   endIndex: 20,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'package',
//     isConstant: true,
//     code: `'b'`,
//     value: 'b',
//     resolved: undefined
//   },
//   importClause: {
//     default: 'a',
//     named: [],
//     namespace: undefined
//   }
// }

console.log(imports[1])
//=>
// {
//   startIndex: 23,
//   endIndex: 47,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'relative',
//     isConstant: true,
//     code: `'./d'`,
//     value: './d',
//     resolved: undefined
//   },
//   importClause: {
//     default: undefined,
//     named: [],
//     namespace: 'c'
//   }
// }

console.log(imports[5])
//=>
// {
//   startIndex: 153,
//   endIndex: 186,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'absolute',
//     isConstant: true,
//     code: '"/v"',
//     value: '/v',
//     resolved: undefined
//   },
//   importClause: {
//     default: 'r',
//     named: [
//       { specifier: 's', binding: 't' },
//       { specifier: 'u', binding: 'u' }
//     ],
//     namespace: undefined
//   }
// }

console.log(imports[7])
//=>
// {
//   startIndex: 238,
//   endIndex: 249,
//   isDynamicImport: true,
//   moduleSpecifier: {
//     type: 'package',
//     isConstant: true,
//     code: '"w"',
//     value: 'w',
//     resolved: undefined
//   },
//   importClause: undefined
// }

console.log(imports[8])
//=>
// {
//   startIndex: 260,
//   endIndex: 277,
//   isDynamicImport: true,
//   moduleSpecifier: {
//     type: 'unknown',
//     isConstant: false,
//     code: '"x" + "y"',
//     value: undefined,
//     resolved: undefined
//   },
//   importClause: undefined
// }
```

## API

### `parseImports(code[, options]) -> Promise<Iterable<Import>>`

Returns a `Promise` resolving to a lazy
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)/[iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
that iterates over the imports in `code`.

### Parameters

#### `code`

Type: `string`

The JavaScript code to parse for imports.

#### `options`

Type: `object` (optional)

##### Properties

###### `resolveFrom`

Type: `string` (optional)\
Default: `undefined`

If set to a file path, then `moduleSpecifier.resolved` of the returned `Import`
instances will be set to the result of calling
`require.resolve(moduleSpecifier.value)` from the given file path. Otherwise,
will be `undefined`.

### Types

<!-- eslint-skip -->

```ts
type ModuleSpecifierType =
  | 'invalid'
  | 'absolute'
  | 'relative'
  | 'builtin'
  | 'package'
  | 'unknown'

type Import = {
  startIndex: number
  endIndex: number
  isDynamicImport: boolean
  moduleSpecifier: {
    type: ModuleSpecifierType
    isConstant: boolean
    code: string
    value?: string
    resolved?: string
  }
  importClause?: {
    default?: string
    named: string[]
    namespace?: string
  }
}
```

#### `Import`

`code.substring(startIndex, endIndex)` returns the full import statement or
expression.

`moduleSpecifier.isConstant` is `true` when the import is not a dynamic import
(`isDynamicImport` is `false`), or when the import is a dynamic import where the
specifier is a simple string literal (e.g. `import('fs')`, `import("fs")`,
``import(`fs`)``).

If `moduleSpecifier.isConstant` is `false`, then `moduleSpecifier.type` is
`'unknown'`. Otherwise, it is set according to the following rules:

- `'invalid'` if the module specifier is the empty string
- `'absolute'` if the module specifier is an absolute file path
- `'relative'` if the module specifier is a relative file path
- `'builtin'` if the module specifier is the name of a builtin Node.js package
- `'package'` otherwise

`moduleSpecifier.code` is the module specifier as it was written in the code.
For non-constant dynamic imports it could be a complex expression.

`moduleSpecifier.value` is `moduleSpecifier.code` without string literal quotes
and unescaped if `moduleSpecifier.isConstant` is `true`. Otherwise, it is
`undefined`.

`moduleSpecifier.resolved` is set if the `resolveFrom` option is set and
`moduleSpecifier.value` is not `undefined`.

`importClause` is only `undefined` if `isDynamicImport` is `true`.

`importClause.default` is the default import identifier or `undefined` if the
import statement does not have a default import.

`importClause.named` is the array of objects representing the named imports of
the import statement. It is empty if the import statement does not have any
named imports. Each object in the array has a `specifier` field set to the
imported identifier and a `binding` field set to the identifier for accessing
the imported value. For example, `import { a, x as y } from 'something'` would
have the following array for `importClause.named`:
`[{ specifier: 'a', binding: 'a' }, { specifier: 'x', binding: 'y' }]`.

`importClause.namespace` is the namespace import identifier or `undefined` if
the import statement does not have a namespace import.

## Contributing

Stars are always welcome!

For bugs and feature requests,
[please create an issue](https://github.com/TomerAberbach/parse-imports/issues/new).

For pull requests, please read the
[contributing guidelines](https://github.com/TomerAberbach/parse-imports/blob/main/contributing.md).

## License

[Apache 2.0](https://github.com/TomerAberbach/parse-imports/blob/main/license)

This is not an official Google product.
