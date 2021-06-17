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

import { join, dirname } from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import test from 'ava'
import parseImports from '../src/index.js'

const currentDirectoryPath = dirname(fileURLToPath(import.meta.url))

const macro = async (t, path, resolveFrom, expectedImports) => {
  const code = await fs.readFile(
    join(currentDirectoryPath, `fixtures`, path),
    `utf8`
  )

  t.log(
    [...(await parseImports(code, { resolveFrom }))].map(
      ({ startIndex, endIndex }) => ({
        startIndex,
        endIndex,
        s: code.substring(startIndex, endIndex)
      })
    )
  )
  t.deepEqual([...(await parseImports(code, { resolveFrom }))], expectedImports)
}

test(`parses imports without resolving`, macro, `no-resolve.js`, false, [
  {
    startIndex: 673,
    endIndex: 694,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `'./wow'`,
      value: `./wow`,
      resolved: undefined
    },
    importClause: {
      default: `a`,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 695,
    endIndex: 726,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `"great"`,
      value: `great`,
      resolved: undefined
    },
    importClause: {
      default: `b`,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 774,
    endIndex: 797,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `"\\n"`,
      value: `\n`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: `d`
    }
  },
  {
    startIndex: 841,
    endIndex: 862,
    isDynamicImport: true,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `\`../../hello\``,
      value: `../../hello`,
      resolved: undefined
    },
    importClause: undefined
  },
  {
    startIndex: 866,
    endIndex: 914,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `builtin`,
      isConstant: true,
      code: `'module'`,
      value: `module`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: `f`
    }
  },
  {
    startIndex: 916,
    endIndex: 947,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `absolute`,
      isConstant: true,
      code: `'/absolute/path'`,
      value: `/absolute/path`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 948,
    endIndex: 981,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `absolute`,
      isConstant: true,
      code: `'/absoluter/path'`,
      value: `/absoluter/path`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 982,
    endIndex: 1017,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `absolute`,
      isConstant: true,
      code: `'/absolutest/path'`,
      value: `/absolutest/path`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1018,
    endIndex: 1060,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `absolute`,
      isConstant: true,
      code: `'/absolutester/path'`,
      value: `/absolutester/path`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1062,
    endIndex: 1105,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `'./x'`,
      value: `./x`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [
        { specifier: `g`, binding: `h` },
        { specifier: `i`, binding: `j` },
        { specifier: `k`, binding: `k` }
      ],
      namespace: undefined
    }
  },
  {
    startIndex: 1117,
    endIndex: 1129,
    isDynamicImport: true,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `'hi'`,
      value: `hi`,
      resolved: undefined
    },
    importClause: undefined
  },
  {
    startIndex: 1143,
    endIndex: 1162,
    isDynamicImport: true,
    moduleSpecifier: {
      type: `unknown`,
      isConstant: false,
      code: `'hello' + 2`,
      value: undefined,
      resolved: undefined
    },
    importClause: undefined
  },
  {
    startIndex: 1164,
    endIndex: 1187,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `'./hello'`,
      value: `./hello`,
      resolved: undefined
    },
    importClause: {
      default: `x`,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1188,
    endIndex: 1230,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `'../../amazing/sdfsd'`,
      value: `../../amazing/sdfsd`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [
        { specifier: `y`, binding: `y` },
        { specifier: `s`, binding: `s` }
      ],
      namespace: undefined
    }
  },
  {
    startIndex: 1232,
    endIndex: 1252,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `"a/b"`,
      value: `a/b`,
      resolved: undefined
    },
    importClause: {
      default: `ab`,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1254,
    endIndex: 1298,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `'parse-imports'`,
      value: `parse-imports`,
      resolved: undefined
    },
    importClause: {
      default: `john`,
      named: [{ specifier: `y`, binding: `m` }],
      namespace: undefined
    }
  },
  {
    startIndex: 1300,
    endIndex: 1331,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `package`,
      isConstant: true,
      code: `'sdfs'`,
      value: `sdfs`,
      resolved: undefined
    },
    importClause: {
      default: `p`,
      named: [],
      namespace: `g`
    }
  },
  {
    startIndex: 1333,
    endIndex: 1353,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `"../sdfsd.js"`,
      value: `../sdfsd.js`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1355,
    endIndex: 1398,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `absolute`,
      isConstant: true,
      code: `'/absolutely/great'`,
      value: `/absolutely/great`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: `bester`
    }
  },
  {
    startIndex: 1422,
    endIndex: 1443,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `relative`,
      isConstant: true,
      code: `"../\\r\\b130\\""`,
      value: `../\r\b130"`,
      resolved: undefined
    },
    importClause: {
      default: undefined,
      named: [],
      namespace: undefined
    }
  },
  {
    startIndex: 1445,
    endIndex: 1461,
    isDynamicImport: false,
    moduleSpecifier: {
      type: `invalid`,
      isConstant: true,
      code: `''`,
      value: ``,
      resolved: undefined
    },
    importClause: {
      default: `z`,
      named: [],
      namespace: undefined
    }
  }
])

test(
  `parses imports with resolving 1`,
  macro,
  `resolve/a.js`,
  join(currentDirectoryPath, `fixtures/resolve/a.js`),
  []
)

test(
  `parses imports with resolving 2`,
  macro,
  `resolve/b.js`,
  join(currentDirectoryPath, `fixtures/resolve/b.js`),
  [
    {
      startIndex: 597,
      endIndex: 637,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./a'`,
        value: `./a`,
        resolved: join(currentDirectoryPath, `fixtures/resolve/a.js`)
      },
      importClause: {
        default: `ahem`,
        named: [
          { specifier: `x`, binding: `x` },
          { specifier: `y`, binding: `y` },
          { specifier: `z`, binding: `b` }
        ],
        namespace: undefined
      }
    },
    {
      startIndex: 638,
      endIndex: 663,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./wow'`,
        value: `./wow`,
        resolved: join(currentDirectoryPath, `fixtures/resolve/wow/index.js`)
      },
      importClause: {
        default: undefined,
        named: [{ specifier: `o`, binding: `o` }],
        namespace: undefined
      }
    },
    {
      startIndex: 664,
      endIndex: 683,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./c'`,
        value: `./c`,
        resolved: join(currentDirectoryPath, `fixtures/resolve/c.js`)
      },
      importClause: {
        default: `c`,
        named: [],
        namespace: undefined
      }
    },
    {
      startIndex: 684,
      endIndex: 722,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `package`,
        isConstant: true,
        code: `'es-module-lexer'`,
        value: `es-module-lexer`,
        resolved: join(
          currentDirectoryPath,
          `../node_modules/.pnpm/es-module-lexer@0.4.1/node_modules/es-module-lexer/dist/lexer.cjs`
        )
      },
      importClause: {
        default: undefined,
        named: [{ specifier: `init`, binding: `init` }],
        namespace: undefined
      }
    }
  ]
)

test(
  `parses imports with resolving 3`,
  macro,
  `resolve/c.js`,
  join(currentDirectoryPath, `fixtures/resolve/c.js`),
  []
)

test(
  `parses imports with resolving 4`,
  macro,
  `resolve/wow/d.js`,
  join(currentDirectoryPath, `fixtures/resolve/wow/d.js`),
  [
    {
      startIndex: 597,
      endIndex: 616,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `builtin`,
        isConstant: true,
        code: `'fs'`,
        value: `fs`,
        resolved: `fs`
      },
      importClause: {
        default: `fs`,
        named: [],
        namespace: undefined
      }
    }
  ]
)

test(
  `parses imports with resolving 5`,
  macro,
  `resolve/wow/index.js`,
  join(currentDirectoryPath, `fixtures/resolve/wow/index.js`),
  [
    {
      startIndex: 597,
      endIndex: 624,
      isDynamicImport: false,
      moduleSpecifier: {
        type: `builtin`,
        isConstant: true,
        code: `'path'`,
        value: `path`,
        resolved: `path`
      },
      importClause: {
        default: undefined,
        named: [{ specifier: `join`, binding: `join` }],
        namespace: undefined
      }
    },
    {
      startIndex: 676,
      endIndex: 689,
      isDynamicImport: true,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `\`./d\``,
        value: `./d`,
        resolved: join(currentDirectoryPath, `fixtures/resolve/wow/d.js`)
      },
      importClause: undefined
    }
  ]
)
