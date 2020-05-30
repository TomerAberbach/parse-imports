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

  t.plan(expectedImports.length + 1)

  let i = 0
  for await (const $import of parseImports(code, { resolveFrom })) {
    t.deepEqual($import, expectedImports[i++])
  }

  t.deepEqual(await parseImports.array(code, { resolveFrom }), expectedImports)
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
  }
])
