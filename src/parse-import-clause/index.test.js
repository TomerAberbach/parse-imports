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

import test from 'ava'
import parseImportClause from './index'

const macro = (t, importClauseString, importClause) => {
  t.deepEqual(parseImportClause(importClauseString), importClause)
}
macro.title = (providedTitle = ``, importClauseString, importClause) =>
  `${providedTitle} parseImportClause(${importClauseString}) = ${JSON.stringify(
    importClause
  )}`.trim()

// Import syntax: https://www.ecma-international.org/ecma-262/#sec-imports
test(macro, `a`, {
  default: `a`,
  named: [],
  namespace: undefined
})

test(macro, `asdas`, {
  default: `asdas`,
  named: [],
  namespace: undefined
})

test(macro, `* as sdfs`, {
  default: undefined,
  named: [],
  namespace: `sdfs`
})

test(macro, `* as wow`, {
  default: undefined,
  named: [],
  namespace: `wow`
})

test(macro, `{}`, {
  default: undefined,
  named: [],
  namespace: undefined
})

test(macro, `{ }`, {
  default: undefined,
  named: [],
  namespace: undefined
})

test(macro, `{  }`, {
  default: undefined,
  named: [],
  namespace: undefined
})

test(macro, `{a}`, {
  default: undefined,
  named: [{ specifier: `a`, binding: `a` }],
  namespace: undefined
})

test(macro, `{ a}`, {
  default: undefined,
  named: [{ specifier: `a`, binding: `a` }],
  namespace: undefined
})

test(macro, `{ a }`, {
  default: undefined,
  named: [{ specifier: `a`, binding: `a` }],
  namespace: undefined
})

test(macro, `{a }`, {
  default: undefined,
  named: [{ specifier: `a`, binding: `a` }],
  namespace: undefined
})

test(macro, `{  asd    }`, {
  default: undefined,
  named: [{ specifier: `asd`, binding: `asd` }],
  namespace: undefined
})

test(macro, `{  asd   as y   }`, {
  default: undefined,
  named: [{ specifier: `asd`, binding: `y` }],
  namespace: undefined
})

test(macro, `{  asd   as y, x   }`, {
  default: undefined,
  named: [
    { specifier: `asd`, binding: `y` },
    { specifier: `x`, binding: `x` }
  ],
  namespace: undefined
})

test(macro, `{ m, asd   as y, x, sdf, esd as jsd   }`, {
  default: undefined,
  named: [
    { specifier: `m`, binding: `m` },
    { specifier: `asd`, binding: `y` },
    { specifier: `x`, binding: `x` },
    { specifier: `sdf`, binding: `sdf` },
    { specifier: `esd`, binding: `jsd` }
  ],
  namespace: undefined
})

test(macro, `{m,asd as y,x,sdf,esd as jsd}`, {
  default: undefined,
  named: [
    { specifier: `m`, binding: `m` },
    { specifier: `asd`, binding: `y` },
    { specifier: `x`, binding: `x` },
    { specifier: `sdf`, binding: `sdf` },
    { specifier: `esd`, binding: `jsd` }
  ],
  namespace: undefined
})

test(macro, `wow, {m,asd as y,x,sdf,esd as jsd}`, {
  default: `wow`,
  named: [
    { specifier: `m`, binding: `m` },
    { specifier: `asd`, binding: `y` },
    { specifier: `x`, binding: `x` },
    { specifier: `sdf`, binding: `sdf` },
    { specifier: `esd`, binding: `jsd` }
  ],
  namespace: undefined
})

test(macro, `wow   , {m,asd as y,x,sdf,esd as jsd}`, {
  default: `wow`,
  named: [
    { specifier: `m`, binding: `m` },
    { specifier: `asd`, binding: `y` },
    { specifier: `x`, binding: `x` },
    { specifier: `sdf`, binding: `sdf` },
    { specifier: `esd`, binding: `jsd` }
  ],
  namespace: undefined
})

test(macro, `wow   , * as    g`, {
  default: `wow`,
  named: [],
  namespace: `g`
})
