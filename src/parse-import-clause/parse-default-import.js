import { skipNonSeparators } from './skip.js'

const parseDefaultImport = (importClauseString, i) => {
  const startIndex = i
  i = skipNonSeparators(importClauseString, i)

  return { defaultImport: importClauseString.slice(startIndex, i), i }
}

export default parseDefaultImport
