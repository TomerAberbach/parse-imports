import fs from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from '@fast-check/vitest'
import { expect, expectTypeOf } from 'vitest'
import { parseImports, parseImportsSync, wasmLoadPromise } from './index.js'
import type { Import } from './index.js'

const currentDirectoryPath = dirname(fileURLToPath(import.meta.url))

test.each([
  {
    path: `no-resolve.js`,
    resolveFrom: undefined,
    expectedImports: [
      {
        startIndex: 76,
        endIndex: 97,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 90,
          endIndex: 97,
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
        startIndex: 98,
        endIndex: 129,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 122,
          endIndex: 129,
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
        startIndex: 177,
        endIndex: 200,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 196,
          endIndex: 200,
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
        startIndex: 244,
        endIndex: 265,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 251,
          endIndex: 264,
          isConstant: true,
          code: `\`../../hello\``,
          value: `../../hello`,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 269,
        endIndex: 317,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 309,
          endIndex: 317,
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
        startIndex: 319,
        endIndex: 350,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 334,
          endIndex: 350,
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
        startIndex: 351,
        endIndex: 384,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 367,
          endIndex: 384,
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
        startIndex: 385,
        endIndex: 420,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 402,
          endIndex: 420,
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
        startIndex: 421,
        endIndex: 463,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 443,
          endIndex: 463,
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
        startIndex: 465,
        endIndex: 508,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 503,
          endIndex: 508,
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
        startIndex: 520,
        endIndex: 532,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `package`,
          startIndex: 527,
          endIndex: 531,
          isConstant: true,
          code: `'hi'`,
          value: `hi`,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 546,
        endIndex: 565,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `unknown`,
          startIndex: 553,
          endIndex: 564,
          isConstant: false,
          code: `'hello' + 2`,
          value: undefined,
          resolved: undefined,
        },
        importClause: undefined,
      },
      {
        startIndex: 567,
        endIndex: 590,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 581,
          endIndex: 590,
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
        startIndex: 591,
        endIndex: 633,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 612,
          endIndex: 633,
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
        startIndex: 635,
        endIndex: 655,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 650,
          endIndex: 655,
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
        startIndex: 657,
        endIndex: 701,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 686,
          endIndex: 701,
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
        startIndex: 703,
        endIndex: 734,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 728,
          endIndex: 734,
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
        startIndex: 736,
        endIndex: 756,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 743,
          endIndex: 756,
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
        startIndex: 758,
        endIndex: 801,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `absolute`,
          startIndex: 782,
          endIndex: 801,
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
        startIndex: 825,
        endIndex: 846,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 832,
          endIndex: 846,
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
        startIndex: 848,
        endIndex: 864,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `invalid`,
          startIndex: 862,
          endIndex: 864,
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
        startIndex: 0,
        endIndex: 40,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 35,
          endIndex: 40,
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
        startIndex: 41,
        endIndex: 66,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 59,
          endIndex: 66,
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
        startIndex: 67,
        endIndex: 86,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 81,
          endIndex: 86,
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
        startIndex: 87,
        endIndex: 125,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `package`,
          startIndex: 108,
          endIndex: 125,
          isConstant: true,
          code: `'es-module-lexer'`,
          value: `es-module-lexer`,
          resolved: join(
            currentDirectoryPath,
            `../node_modules/.pnpm/es-module-lexer@1.7.0/node_modules/es-module-lexer/dist/lexer.cjs`,
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
        startIndex: 0,
        endIndex: 19,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 15,
          endIndex: 19,
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
        startIndex: 0,
        endIndex: 27,
        isDynamicImport: false,
        moduleSpecifier: {
          type: `builtin`,
          startIndex: 21,
          endIndex: 27,
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
        startIndex: 79,
        endIndex: 92,
        isDynamicImport: true,
        moduleSpecifier: {
          type: `relative`,
          startIndex: 86,
          endIndex: 91,
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
  expectTypeOf(parseImports(`some code`)).toEqualTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`))
  expectTypeOf(parseImports(`some code`)).toEqualTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`, {}))
  expectTypeOf(parseImports(`some code`)).toEqualTypeOf<
    Promise<Iterable<Import>>
  >(parseImports(`some code`, { resolveFrom: `./wow` }))

  expectTypeOf(parseImportsSync(`some code`)).toEqualTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`),
  )
  expectTypeOf(parseImportsSync(`some code`)).toEqualTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`, {}),
  )
  expectTypeOf(parseImportsSync(`some code`)).toEqualTypeOf<Iterable<Import>>(
    parseImportsSync(`some code`, { resolveFrom: `./wow` }),
  )
})
