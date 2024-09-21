import { builtinModules } from 'node:module'
import { fc, test } from 'tomer'
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

test.prop([prefixedString(`/`)])(`parses absolute imports`, moduleSpecifier => {
  const type = parseType(moduleSpecifier)

  expect(type).toBe(`absolute`)
})

test.prop([
  fc.oneof(
    prefixedString(`.`),
    prefixedString(`./`),
    prefixedString(`..`),
    prefixedString(`../`),
  ),
])(`parses relative imports`, moduleSpecifier => {
  const type = parseType(moduleSpecifier)

  expect(type).toBe(`relative`)
})

test.each(builtinModules)(`parses builtin imports - %p`, moduleSpecifier => {
  const type = parseType(moduleSpecifier)

  expect(type).toBe(`builtin`)
})

test.prop([
  fc
    .string()
    .filter(
      string =>
        !builtinModules.includes(string) &&
        string.length > 1 &&
        !string.startsWith(`/`) &&
        !string.startsWith(`.`),
    ),
])(`parses package imports`, moduleSpecifier => {
  const type = parseType(moduleSpecifier)

  expect(type).toBe(`package`)
})
