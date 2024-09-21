const parseNamedImports = (importClauseString, i) => {
  const startIndex = ++i

  while (i < importClauseString.length && importClauseString[i] !== `}`) {
    i++
  }

  const namedImports = importClauseString
    .slice(startIndex, i++)
    .split(`,`)
    .map(namedImport => {
      namedImport = namedImport.trim()
      if (namedImport.includes(` `)) {
        const components = namedImport.split(` `)
        return {
          specifier: components[0],
          binding: components.at(-1),
        }
      }
      return { specifier: namedImport, binding: namedImport }
    })
    .filter(({ specifier }) => specifier.length > 0)

  return { namedImports, i }
}

export default parseNamedImports
