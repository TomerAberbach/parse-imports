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
import { testProp, fc } from 'ava-fast-check'
import { fuzzLiteralStringExpression } from 'shift-fuzzer'
import shiftCodegen from 'shift-codegen'
import parseModuleSpecifier from '../../src/parse-module-specifier/index.js'

const { default: render } = shiftCodegen

const macro = (
  t,
  { moduleSpecifierString, isDynamicImport, resolveFrom },
  expectedModuleSpecifier
) => {
  const moduleSpecifier = parseModuleSpecifier(moduleSpecifierString, {
    isDynamicImport,
    resolveFrom
  })

  t.deepEqual(moduleSpecifier, expectedModuleSpecifier)
}

macro.title = (
  // eslint-disable-next-line default-param-last
  providedTitle = ``,
  { moduleSpecifierString, isDynamicImport, resolveFrom },
  expectedModuleSpecifier
) =>
  `${providedTitle} parseModuleSpecifier(${moduleSpecifierString}, ${JSON.stringify(
    { isDynamicImport, resolveFrom }
  )}) = ${JSON.stringify(expectedModuleSpecifier)}`.trim()

test(
  macro,
  { moduleSpecifierString: `\`\\\${\``, isDynamicImport: true },
  {
    type: `package`,
    isConstant: true,
    code: `\`\\\${\``,
    value: `\${`,
    resolved: undefined
  }
)

test(
  macro,
  { moduleSpecifierString: `'hi' + 'wow'`, isDynamicImport: true },
  {
    type: `unknown`,
    isConstant: false,
    code: `'hi' + 'wow'`,
    value: undefined,
    resolved: undefined
  }
)

test(
  macro,
  { moduleSpecifierString: `\`\${__dirname}\``, isDynamicImport: true },
  {
    type: `unknown`,
    isConstant: false,
    code: `\`\${__dirname}\``,
    value: undefined,
    resolved: undefined
  }
)

test(
  macro,
  { moduleSpecifierString: `"\\\\"`, isDynamicImport: true },
  {
    type: `package`,
    isConstant: true,
    code: `"\\\\"`,
    value: `\\`,
    resolved: undefined
  }
)

const simpleLiteral = (quote, escapes = []) =>
  fc
    .stringOf(
      fc
        .string({ minLength: 1, maxLength: 1 })
        .filter(character => ![quote, `\\`, ...escapes].includes(character))
    )
    .map(string => `${quote}${string}${quote}`)

testProp(
  `parses simple literals`,
  [
    fc.oneof(
      simpleLiteral(`'`),
      simpleLiteral(`"`),
      simpleLiteral(`\``, [`$`, `{`])
    ),
    fc.boolean()
  ],
  (t, moduleSpecifierString, isDynamicImport) => {
    const { isConstant, value } = parseModuleSpecifier(moduleSpecifierString, {
      isDynamicImport
    })

    t.true(isConstant)
    t.is(
      value,
      moduleSpecifierString.substring(1, moduleSpecifierString.length - 1)
    )
  },
  { numRuns: 300 }
)

const escapedLiteral = (quote, escapes = [], extra = []) =>
  fc
    .stringOf(
      fc.oneof(
        fc
          .string({ minLength: 1, maxLength: 1 })
          .map(character => `\\${character}`),
        fc
          .string({ minLength: 1, maxLength: 1 })
          .filter(character => ![quote, `\\`, ...escapes].includes(character)),
        ...extra
      )
    )
    .map(string => `${quote}${string}${quote}`)

testProp(
  `parses escaped literals as constant`,
  [fc.oneof(escapedLiteral(`'`), escapedLiteral(`"`)), fc.boolean()],
  (t, moduleSpecifierString, isDynamicImport) => {
    t.true(
      parseModuleSpecifier(moduleSpecifierString, isDynamicImport).isConstant
    )
  },
  { numRuns: 200 }
)

testProp(
  `parses escaped template literals as constant`,
  [escapedLiteral(`\``, [`$`, `{`], [fc.constant(`\\\${`)])],
  (t, moduleSpecifierString) => {
    t.true(
      parseModuleSpecifier(moduleSpecifierString, { isDynamicImport: true })
        .isConstant
    )
  },
  { numRuns: 500 }
)

test(`fuzz parse moduleSpecifierString`, t => {
  for (let i = 0; i < 300; i++) {
    const moduleSpecifierString = render(fuzzLiteralStringExpression())
    t.true(
      parseModuleSpecifier(moduleSpecifierString, { isDynamicImport: true })
        .isConstant
    )
  }
})
