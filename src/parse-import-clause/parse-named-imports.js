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
          binding: components[components.length - 1],
        }
      }
      return { specifier: namedImport, binding: namedImport }
    })
    .filter(({ specifier }) => specifier.length > 0)

  return { namedImports, i }
}

export default parseNamedImports
