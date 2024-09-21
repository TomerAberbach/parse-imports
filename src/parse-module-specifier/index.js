import assert from 'node:assert'
import { removeSlashes } from 'slashes'
import isConstantStringLiteral from './is-constant-string-literal.js'
import parseType from './parse-type.js'
import resolve from './resolve.js'

const parseModuleSpecifier = (
  moduleSpecifierString,
  { isDynamicImport, resolveFrom },
) => {
  assert(isDynamicImport || isConstantStringLiteral(moduleSpecifierString))

  const { isConstant, value } =
    !isDynamicImport || isConstantStringLiteral(moduleSpecifierString)
      ? {
          isConstant: true,
          value: removeSlashes(moduleSpecifierString.slice(1, -1)),
        }
      : { isConstant: false, value: undefined }

  return {
    type: isConstant ? parseType(value) : `unknown`,
    isConstant,
    code: moduleSpecifierString,
    value,
    resolved:
      typeof resolveFrom === `string` && isConstant
        ? resolve(resolveFrom, value)
        : undefined,
  }
}

export default parseModuleSpecifier
