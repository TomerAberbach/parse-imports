import { parseImports } from './src/index.js'

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
// =>
// {
//   startIndex: 3,
//   endIndex: 20,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'package',
//     startIndex: 17,
//     endIndex: 20,
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
// =>
// {
//   startIndex: 23,
//   endIndex: 47,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'relative',
//     startIndex: 42,
//     endIndex: 47,
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
// =>
// {
//   startIndex: 153,
//   endIndex: 186,
//   isDynamicImport: false,
//   moduleSpecifier: {
//     type: 'absolute',
//     startIndex: 182,
//     endIndex: 186,
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
// =>
// {
//   startIndex: 238,
//   endIndex: 249,
//   isDynamicImport: true,
//   moduleSpecifier: {
//     type: 'package',
//     startIndex: 245,
//     endIndex: 248,
//     isConstant: true,
//     code: '"w"',
//     value: 'w',
//     resolved: undefined
//   },
//   importClause: undefined
// }

console.log(imports[8])
// =>
// {
//   startIndex: 260,
//   endIndex: 277,
//   isDynamicImport: true,
//   moduleSpecifier: {
//     type: 'unknown',
//     startIndex: 267,
//     endIndex: 276,
//     isConstant: false,
//     code: '"x" + "y"',
//     value: undefined,
//     resolved: undefined
//   },
//   importClause: undefined
// }
