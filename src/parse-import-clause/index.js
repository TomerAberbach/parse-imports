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

import { separatorRegex } from './skip.js'
import parseNamedImports from './parse-named-imports.js'
import parseNamespaceImport from './parse-namespace-import.js'
import parseDefaultImport from './parse-default-import.js'

// Assumes import clause is syntactically valid
const parseImportClause = importClauseString => {
  let defaultImport
  let namespaceImport
  const namedImports = []

  for (let i = 0; i < importClauseString.length; i++) {
    if (separatorRegex.test(importClauseString[i])) {
      continue
    }

    if (importClauseString[i] === `{`) {
      let newNamedImports
      ;({ namedImports: newNamedImports, i } = parseNamedImports(
        importClauseString,
        i,
      ))
      namedImports.push(...newNamedImports)
    } else if (importClauseString[i] === `*`) {
      ;({ namespaceImport, i } = parseNamespaceImport(importClauseString, i))
    } else {
      ;({ defaultImport, i } = parseDefaultImport(importClauseString, i))
    }
  }

  return {
    default: defaultImport,
    namespace: namespaceImport,
    named: namedImports,
  }
}

export default parseImportClause
