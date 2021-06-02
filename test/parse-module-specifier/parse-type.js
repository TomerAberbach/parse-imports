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

import { builtinModules } from 'module'
import test from 'ava'
import { testProp, fc } from 'ava-fast-check'
import parseType from '../../src/parse-module-specifier/parse-type.js'

const macro = (t, moduleSpecifier, type) => {
  t.is(parseType(moduleSpecifier), type)
}

// eslint-disable-next-line default-param-last
macro.title = (providedTitle = ``, moduleSpecifier, type) =>
  `${providedTitle} parses ${type} import ${moduleSpecifier}`.trim()

test(macro, ``, `invalid`)
test(macro, `/home/tomeraberbach/Desktop/wow`, `absolute`)
test(macro, `./nice`, `relative`)
test(macro, `fs`, `builtin`)
test(macro, `parse-imports`, `package`)

const prefixedString = prefix => fc.string().map(string => `${prefix}${string}`)
const assertType = type => (t, moduleSpecifier) => {
  t.is(parseType(moduleSpecifier), type)
}

testProp(
  `parses absolute imports`,
  [prefixedString(`/`)],
  assertType(`absolute`)
)

testProp(
  `parses relative imports`,
  [
    fc.oneof(
      prefixedString(`.`),
      prefixedString(`./`),
      prefixedString(`..`),
      prefixedString(`../`)
    )
  ],
  assertType(`relative`)
)

testProp(
  `parses builtin imports`,
  [fc.constantFrom(...builtinModules)],
  assertType(`builtin`)
)

testProp(
  `parses package imports`,
  [
    fc
      .string()
      .filter(
        string =>
          string.length > 1 &&
          !string.startsWith(`/`) &&
          !string.startsWith(`.`)
      )
  ],
  assertType(`package`)
)
