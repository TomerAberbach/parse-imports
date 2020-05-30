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
import parseModuleSpecifier from './parse-module-specifier'
import parseImportClause from './parse-import-clause'

async function* parseImports(code, { resolveFrom } = {}) {
  const [imports] = await parse(code, resolveFrom ?? undefined)

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
      isDynamicImport,
      moduleSpecifier,
      importClause
    }
  }
}

parseImports.array = async (code, options) => {
  const array = []

  for await (const $import of parseImports(code, options)) {
    array.push($import)
  }

  return array
}

export default parseImports
