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

import { join } from 'path'
import { promises as fs } from 'fs'
import test from 'ava'
import parseImports from './index'

const macro = async (t, path, resolveFrom, expectedImports) => {
  const code = await fs.readFile(join(__dirname, `fixtures`, path), `utf8`)

  t.deepEqual([...(await parseImports(code, { resolveFrom }))], expectedImports)
}

test(`parses imports without resolving`, macro, `no-resolve.js`, false, [
  {
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
  join(__dirname, `fixtures/resolve/a.js`),
  []
)

test(
  `parses imports with resolving 2`,
  macro,
  `resolve/b.js`,
  join(__dirname, `fixtures/resolve/b.js`),
  [
    {
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./a'`,
        value: `./a`,
        resolved: join(__dirname, `fixtures/resolve/a.js`)
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
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./wow'`,
        value: `./wow`,
        resolved: join(__dirname, `fixtures/resolve/wow/index.js`)
      },
      importClause: {
        default: undefined,
        named: [{ specifier: `o`, binding: `o` }],
        namespace: undefined
      }
    },
    {
      isDynamicImport: false,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `'./c'`,
        value: `./c`,
        resolved: join(__dirname, `fixtures/resolve/c.js`)
      },
      importClause: {
        default: `c`,
        named: [],
        namespace: undefined
      }
    },
    {
      isDynamicImport: false,
      moduleSpecifier: {
        type: `package`,
        isConstant: true,
        code: `'es-module-lexer'`,
        value: `es-module-lexer`,
        resolved: join(
          __dirname,
          `../node_modules/.pnpm/es-module-lexer@0.3.26/node_modules/es-module-lexer/dist/lexer.cjs`
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
  join(__dirname, `fixtures/resolve/c.js`),
  []
)

test(
  `parses imports with resolving 4`,
  macro,
  `resolve/wow/d.js`,
  join(__dirname, `fixtures/resolve/wow/d.js`),
  [
    {
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
  join(__dirname, `fixtures/resolve/wow/index.js`),
  [
    {
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
      isDynamicImport: true,
      moduleSpecifier: {
        type: `relative`,
        isConstant: true,
        code: `\`./d\``,
        value: `./d`,
        resolved: join(__dirname, `fixtures/resolve/wow/d.js`)
      },
      importClause: undefined
    }
  ]
)
