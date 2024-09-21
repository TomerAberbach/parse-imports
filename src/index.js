import { init, parse } from 'es-module-lexer'
import parseImportClause from './parse-import-clause/index.js'
import parseModuleSpecifier from './parse-module-specifier/index.js'

export const wasmLoadPromise = init

export const parseImports = async (code, options) => {
  await wasmLoadPromise
  return parseImportsSync(code, options)
}

export const parseImportsSync = (code, { resolveFrom } = {}) => {
  const result = parse(code, resolveFrom == null ? undefined : resolveFrom)
  if (!Array.isArray(result)) {
    throw new TypeError(
      `Expected WASM to be loaded before calling parseImportsSync`,
    )
  }
  const [imports] = result

  return {
    *[Symbol.iterator]() {
      for (let {
        d: dynamicImportStartIndex,
        ss: statementStartIndex,
        s: moduleSpecifierStartIndex,
        e: moduleSpecifierEndIndexExclusive,
      } of imports) {
        const isImportMeta = dynamicImportStartIndex === -2
        if (isImportMeta) {
          continue
        }

        const isDynamicImport = dynamicImportStartIndex > -1

        // Include string literal quotes in character range
        if (!isDynamicImport) {
          moduleSpecifierStartIndex--
          moduleSpecifierEndIndexExclusive++
        }

        const moduleSpecifierString = code.slice(
          moduleSpecifierStartIndex,
          moduleSpecifierEndIndexExclusive,
        )
        const moduleSpecifier = {
          startIndex: moduleSpecifierStartIndex,
          endIndex: moduleSpecifierEndIndexExclusive,
          ...parseModuleSpecifier(moduleSpecifierString, {
            isDynamicImport,
            resolveFrom,
          }),
        }

        let importClause
        if (!isDynamicImport) {
          let importClauseString = code
            .slice(
              statementStartIndex + `import`.length,
              moduleSpecifierStartIndex,
            )
            .trim()
          if (importClauseString.endsWith(`from`)) {
            importClauseString = importClauseString.slice(
              0,
              Math.max(0, importClauseString.length - `from`.length),
            )
          }
          importClause = parseImportClause(importClauseString)
        }

        yield {
          startIndex: statementStartIndex,
          // Include the closing parenthesis for dynamic import
          endIndex: isDynamicImport
            ? moduleSpecifierEndIndexExclusive + 1
            : moduleSpecifierEndIndexExclusive,
          isDynamicImport,
          moduleSpecifier,
          importClause,
        }
      }
    },
  }
}
