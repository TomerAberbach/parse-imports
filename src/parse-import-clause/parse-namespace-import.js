import { skipNonSeparators, skipSeparators } from './skip.js'

const parseNamespaceImport = (importClauseString, i) => {
  i++
  i = skipSeparators(importClauseString, i)
  i += `as`.length
  i = skipSeparators(importClauseString, i)

  const startIndex = i
  i = skipNonSeparators(importClauseString, i)

  return {
    namespaceImport: importClauseString.slice(startIndex, i),
    i,
  }
}

export default parseNamespaceImport
