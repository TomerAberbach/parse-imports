# Parse Imports

> A blazing fast ES module imports parser.

## Features

- Uses the superb WASM-based [`es-module-lexer`](https://github.com/guybedford/es-module-lexer) under the hood
- Identifies module specifier types (e.g. relative file import, package import, builtin import, etc.)
- Unescapes module specifier escape sequences
- Collects default, named, and namespace imports
- Works with dynamic imports
- Resolves module specifier paths via `require.resolve`

## Install

Supports Node.js versions 10 and above.

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

const main = async () => {
  // Lazily iterate of async iterable of imports
  for await (const $import of parseImports(code)) {
    console.log($import)
  }

  // Or get as an array of imports
  const imports = await parseImports.array(code)

  console.log(imports[0])
  //=>
  // {
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

  console.log(imports[8])
  //=>
  // {
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

  console.log(imports[9])
  //=>
  // {
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
}
```

## API

### Functions

#### `parseImports(code[, options]) -> AsyncIterableIterator<Import>`

Returns a lazy [async iterable/iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) that asynchronously iterates over the imports in `code`.

#### `parseImports.array(code[, options]) -> Promise<Import[]>`

Returns a `Promise` containing the array of imports in `code`.

### Parameters

#### `code`

Type: `string`

The JavaScript code to parse for imports.

#### `options`

Type: `object`

##### Properties

###### `resolveFrom`

Type: `string`\
Default: `undefined`

If set to a file path, then `moduleSpecifier.resolved` of the returned `Import` instances will be set to the result of calling `require.resolve(moduleSpecifier.value)` from the given file path. Otherwise, will be `undefined`.

### Types

```ts
type ModuleSpecifierType =
  | 'invalid'
  | 'absolute'
  | 'relative'
  | 'builtin'
  | 'package'

type Import = {
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

## Contributing

Stars are always welcome!

For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/parse-imports/issues/new).

For pull requests, please read the [contributing guidelines](https://github.com/TomerAberbach/parse-imports/blob/master/contributing.md).

## License

[Apache 2.0](https://github.com/TomerAberbach/parse-imports/blob/master/license)

This is not an official Google product.
