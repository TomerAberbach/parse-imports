// Assumes the string is syntactically valid
const isConstantStringLiteral = stringLiteral => {
  const quote = [`'`, `"`, `\``].find(
    quoteCandidate =>
      stringLiteral.startsWith(quoteCandidate) &&
      stringLiteral.endsWith(quoteCandidate),
  )

  if (quote == null) {
    return false
  }

  for (let i = 1; i < stringLiteral.length - 1; i++) {
    // Check for end of string literal before end of stringLiteral
    if (stringLiteral[i] === quote && stringLiteral[i - 1] !== `\\`) {
      return false
    }

    // Check for interpolated value in template literal
    if (
      quote === `\`` &&
      stringLiteral.slice(i, i + 2) === `\${` &&
      stringLiteral[i - 1] !== `\\`
    ) {
      return false
    }
  }

  return true
}

export default isConstantStringLiteral
