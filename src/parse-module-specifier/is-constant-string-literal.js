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
