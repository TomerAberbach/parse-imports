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

import { parse } from 'es-module-lexer'
import parseModuleSpecifier from './parse-module-specifier/index.js'
import parseImportClause from './parse-import-clause/index.js'

const parseImports = async (code, { resolveFrom } = {}) => {
  const [imports] = await parse(
    code,
    resolveFrom == null ? undefined : resolveFrom
  )

  return {
    *[Symbol.iterator]() {
      for (let {
        d: dynamicImportStartIndex,
        ss: statementStartIndex,
        s: moduleSpecifierStartIndex,
        e: moduleSpecifierEndIndexExclusive
      } of imports) {
        const isDynamicImport = dynamicImportStartIndex > -1

        // Include string literal quotes in character range
        if (!isDynamicImport) {
          moduleSpecifierStartIndex--
          moduleSpecifierEndIndexExclusive++
        }

        const moduleSpecifierString = code.substring(
          moduleSpecifierStartIndex,
          moduleSpecifierEndIndexExclusive
        )
        const moduleSpecifier = parseModuleSpecifier(moduleSpecifierString, {
          isDynamicImport,
          resolveFrom
        })

        let importClause
        if (!isDynamicImport) {
          let importClauseString = code
            .substring(
              statementStartIndex + `import`.length,
              moduleSpecifierStartIndex
            )
            .trim()
          if (importClauseString.endsWith(`from`)) {
            importClauseString = importClauseString.substring(
              0,
              importClauseString.length - `from`.length
            )
          }
          importClause = parseImportClause(importClauseString)
        }

        yield {
          ...(isDynamicImport
            ? {
                startIndex: dynamicImportStartIndex,

                // Include the closing parenthesis
                endIndex: moduleSpecifierEndIndexExclusive + 1
              }
            : {
                startIndex: statementStartIndex,
                endIndex: moduleSpecifierEndIndexExclusive
              }),
          isDynamicImport,
          moduleSpecifier,
          importClause
        }
      }
    }
  }
}

export default parseImports
