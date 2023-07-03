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
import { fc, testProp } from 'tomer'
import parseType from '../../src/parse-module-specifier/parse-type.js'

test.each([
  {
    moduleSpecifier: ``,
    expectedType: `invalid`,
  },
  {
    moduleSpecifier: `/home/tomeraberbach/Desktop/wow`,
    expectedType: `absolute`,
  },
  {
    moduleSpecifier: `./nice`,
    expectedType: `relative`,
  },
  {
    moduleSpecifier: `fs`,
    expectedType: `builtin`,
  },
  {
    moduleSpecifier: `parse-imports`,
    expectedType: `package`,
  },
])(
  `parses $expectedType import $moduleSpecifier`,
  ({ moduleSpecifier, expectedType }) => {
    const type = parseType(moduleSpecifier)

    expect(type).toBe(expectedType)
  },
)

const prefixedString = (prefix: string) =>
  fc.string().map(string => `${prefix}${string}`)

testProp(`parses absolute imports`, [prefixedString(`/`)], moduleSpecifier => {
  const type = parseType(moduleSpecifier)

  expect(type).toBe(`absolute`)
})

testProp(
  `parses relative imports`,
  [
    fc.oneof(
      prefixedString(`.`),
      prefixedString(`./`),
      prefixedString(`..`),
      prefixedString(`../`),
    ),
  ],
  moduleSpecifier => {
    const type = parseType(moduleSpecifier)

    expect(type).toBe(`relative`)
  },
)

testProp(
  `parses builtin imports`,
  [fc.constantFrom(...builtinModules)],
  moduleSpecifier => {
    const type = parseType(moduleSpecifier)

    expect(type).toBe(`builtin`)
  },
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
          !string.startsWith(`.`),
      ),
  ],
  moduleSpecifier => {
    const type = parseType(moduleSpecifier)

    expect(type).toBe(`package`)
  },
)
