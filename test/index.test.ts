/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expectTypeOf } from 'tomer'
import {
  parseImports,
  parseImportsSync,
  wasmLoadPromise,
} from '../src/index.js'
import type { Import } from '../src/index.js'

const currentDirectoryPath = dirname(fileURLToPath(import.meta.url))

test(`parseImportsSync throws before WASM load`, () => {
  expect(() => parseImportsSync(``)).toThrow(
    new Error(`Expected WASM to be loaded before calling parseImportsSync`),
  )
})

test.each([
  {
    path: `no-resolve.js`,
    resolveFrom: undefined,
    expectedImports: [
      {
        startIndex: 673,
        endIndex: 694,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 687,
          endIndex: 694,
          isConstant: true,
          code: `'./wow'`,
          value: `./wow`,
          resolved: undefined,
        },
        importClause: {
          default: `a`,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 695,
        endIndex: 726,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 719,
          endIndex: 726,
          isConstant: true,
          code: `"great"`,
          value: `great`,
          resolved: undefined,
        },
        importClause: {
          default: `b`,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 774,
        endIndex: 797,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 793,
          endIndex: 797,
          isConstant: true,
          code: `"\\n"`,
          value: `\n`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: `d`,
        },
      },
      {
        startIndex: 841,
        endIndex: 862,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 848,
          endIndex: 861,
          isConstant: true,
          code: `\`../../hello\``,
          value: `../../hello`,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 866,
        endIndex: 914,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 906,
          endIndex: 914,
          isConstant: true,
          code: `'module'`,
          value: `module`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: `f`,
        },
      },
      {
        startIndex: 916,
        endIndex: 947,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 931,
          endIndex: 947,
          isConstant: true,
          code: `'/absolute/path'`,
          value: `/absolute/path`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 948,
        endIndex: 981,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 964,
          endIndex: 981,
          isConstant: true,
          code: `'/absoluter/path'`,
          value: `/absoluter/path`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 982,
        endIndex: 1017,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 999,
          endIndex: 1017,
          isConstant: true,
          code: `'/absolutest/path'`,
          value: `/absolutest/path`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1018,
        endIndex: 1060,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 1040,
          endIndex: 1060,
          isConstant: true,
          code: `'/absolutester/path'`,
          value: `/absolutester/path`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1062,
        endIndex: 1105,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 1100,
          endIndex: 1105,
          isConstant: true,
          code: `'./x'`,
          value: `./x`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [
            { specifier: `g`, binding: `h` },
            { specifier: `i`, binding: `j` },
            { specifier: `k`, binding: `k` },
          ],
          namespace: undefined,
        },
      },
      {
        startIndex: 1117,
        endIndex: 1129,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `package`,
          startIndex: 1124,
          endIndex: 1128,
          isConstant: true,
          code: `'hi'`,
          value: `hi`,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 1143,
        endIndex: 1162,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `unknown`,
          startIndex: 1150,
          endIndex: 1161,
          isConstant: false,
          code: `'hello' + 2`,
          value: undefined,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 1164,
        endIndex: 1187,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 1178,
          endIndex: 1187,
          isConstant: true,
          code: `'./hello'`,
          value: `./hello`,
          resolved: undefined,
        },
        importClause: {
          default: `x`,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1188,
        endIndex: 1230,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 1209,
          endIndex: 1230,
          isConstant: true,
          code: `'../../amazing/sdfsd'`,
          value: `../../amazing/sdfsd`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [
            { specifier: `y`, binding: `y` },
            { specifier: `s`, binding: `s` },
          ],
          namespace: undefined,
        },
      },
      {
        startIndex: 1232,
        endIndex: 1252,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 1247,
          endIndex: 1252,
          isConstant: true,
          code: `"a/b"`,
          value: `a/b`,
          resolved: undefined,
        },
        importClause: {
          default: `ab`,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1254,
        endIndex: 1298,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 1283,
          endIndex: 1298,
          isConstant: true,
          code: `'parse-imports'`,
          value: `parse-imports`,
          resolved: undefined,
        },
        importClause: {
          default: `john`,
          named: [{ specifier: `y`, binding: `m` }],
          namespace: undefined,
        },
      },
      {
        startIndex: 1300,
        endIndex: 1331,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 1325,
          endIndex: 1331,
          isConstant: true,
          code: `'sdfs'`,
          value: `sdfs`,
          resolved: undefined,
        },
        importClause: {
          default: `p`,
          named: [],
          namespace: `g`,
        },
      },
      {
        startIndex: 1333,
        endIndex: 1353,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 1340,
          endIndex: 1353,
          isConstant: true,
          code: `"../sdfsd.js"`,
          value: `../sdfsd.js`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1355,
        endIndex: 1398,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 1379,
          endIndex: 1398,
          isConstant: true,
          code: `'/absolutely/great'`,
          value: `/absolutely/great`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: `bester`,
        },
      },
      {
        startIndex: 1422,
        endIndex: 1443,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 1429,
          endIndex: 1443,
          isConstant: true,
          code: `"../\\r\\b130\\""`,
          value: `../\r\b130"`,
          resolved: undefined,
        },
        importClause: {
          default: undefined,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 1445,
        endIndex: 1461,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `invalid`,
          startIndex: 1459,
          endIndex: 1461,
          isConstant: true,
          code: `''`,
          value: ``,
          resolved: undefined,
        },
        importClause: {
          default: `z`,
          named: [],
          namespace: undefined,
        },
      },
    ],
  },
  {
    path: `resolve/a.js`,
    resolveFrom: join(currentDirectoryPath, `fixtures/resolve/a.js`),
    expectedImports: [],
  },
  {
    path: `resolve/b.js`,
    resolveFrom: join(currentDirectoryPath, `fixtures/resolve/b.js`),
    expectedImports: [
      {
        startIndex: 597,
        endIndex: 637,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 632,
          endIndex: 637,
          isConstant: true,
          code: `'./a'`,
          value: `./a`,
          resolved: join(currentDirectoryPath, `fixtures/resolve/a.js`),
        },
        importClause: {
          default: `ahem`,
          named: [
            { specifier: `x`, binding: `x` },
            { specifier: `y`, binding: `y` },
            { specifier: `z`, binding: `b` },
          ],
          namespace: undefined,
        },
      },
      {
        startIndex: 638,
        endIndex: 663,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 656,
          endIndex: 663,
          isConstant: true,
          code: `'./wow'`,
          value: `./wow`,
          resolved: join(currentDirectoryPath, `fixtures/resolve/wow/index.js`),
        },
        importClause: {
          default: undefined,
          named: [{ specifier: `o`, binding: `o` }],
          namespace: undefined,
        },
      },
      {
        startIndex: 664,
        endIndex: 683,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 678,
          endIndex: 683,
          isConstant: true,
          code: `'./c'`,
          value: `./c`,
          resolved: join(currentDirectoryPath, `fixtures/resolve/c.js`),
        },
        importClause: {
          default: `c`,
          named: [],
          namespace: undefined,
        },
      },
      {
        startIndex: 684,
        endIndex: 722,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 705,
          endIndex: 722,
          isConstant: true,
          code: `'es-module-lexer'`,
          value: `es-module-lexer`,
          resolved: join(
            currentDirectoryPath,
            `../node_modules/.pnpm/es-module-lexer@1.5.2/node_modules/es-module-lexer/dist/lexer.cjs`,
          ),
        },
        importClause: {
          default: undefined,
          named: [{ specifier: `init`, binding: `init` }],
          namespace: undefined,
        },
      },
    ],
  },
  {
    path: `resolve/c.js`,
    resolveFrom: join(currentDirectoryPath, `fixtures/resolve/c.js`),
    expectedImports: [],
  },
  {
    path: `resolve/wow/d.js`,
    resolveFrom: join(currentDirectoryPath, `fixtures/resolve/wow/d.js`),
    expectedImports: [
      {
        startIndex: 597,
        endIndex: 616,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 612,
          endIndex: 616,
          isConstant: true,
          code: `'fs'`,
          value: `fs`,
          resolved: `fs`,
        },
        importClause: {
          default: `fs`,
          named: [],
          namespace: undefined,
        },
      },
    ],
  },
  {
    path: `resolve/wow/index.js`,
    resolveFrom: join(currentDirectoryPath, `fixtures/resolve/wow/index.js`),
    expectedImports: [
      {
        startIndex: 597,
        endIndex: 624,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 618,
          endIndex: 624,
          isConstant: true,
          code: `'path'`,
          value: `path`,
          resolved: `path`,
        },
        importClause: {
          default: undefined,
          named: [{ specifier: `join`, binding: `join` }],
          namespace: undefined,
        },
      },
      {
        startIndex: 676,
        endIndex: 689,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 683,
          endIndex: 688,
          isConstant: true,
          code: `\`./d\``,
          value: `./d`,
          resolved: join(currentDirectoryPath, `fixtures/resolve/wow/d.js`),
        },
        importClause: undefined,
      },
    ],
  },
])(
  `parses imports: $path, $resolveFrom`,
  async ({ path, resolveFrom, expectedImports }) => {
    const code = await fs.readFile(
      join(currentDirectoryPath, `fixtures`, path),
      `utf8`,
    )
    await wasmLoadPromise

    const parsedImportsSync = [...parseImportsSync(code, { resolveFrom })]
    const parsedImports = [...(await parseImports(code, { resolveFrom }))]

    console.log(
      `imports`,
      parsedImports.map(({ startIndex, endIndex }) =>
        code.slice(startIndex, endIndex),
      ),
    )
    console.log(
      `module specifiers`,
      parsedImports.map(({ moduleSpecifier: { startIndex, endIndex } }) =>
        code.slice(startIndex, endIndex),
      ),
    )
    expect(parsedImportsSync).toStrictEqual(expectedImports)
    expect(parsedImports).toStrictEqual(expectedImports)
  },
)

test(`types`, () => {
  expectTypeOf(parseImports(`some code`)).toMatchTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`))
  expectTypeOf(parseImports(`some code`)).toMatchTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`, {}))
  expectTypeOf(parseImports(`some code`)).toMatchTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`, { resolveFrom: `./wow` }))

  expectTypeOf(parseImportsSync(`some code`)).toMatchTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`),
  )
  expectTypeOf(parseImportsSync(`some code`)).toMatchTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`, {}),
  )
  expectTypeOf(parseImportsSync(`some code`)).toMatchTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`, { resolveFrom: `./wow` }),
  )
})
