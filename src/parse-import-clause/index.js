import parseDefaultImport from './parse-default-import.js'
import parseNamedImports from './parse-named-imports.js'
import parseNamespaceImport from './parse-namespace-import.js'
import { separatorRegex } from './skip.js'

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
