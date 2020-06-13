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

/// <reference types="node"/>

declare namespace parseImports {
  export type ModuleSpecifierType =
    | 'invalid'
    | 'absolute'
    | 'relative'
    | 'builtin'
    | 'package'
    | 'unknown'

  export type Import = {
    isDynamicImport: boolean
    moduleSpecifier: {
      type: ModuleSpecifierType
      isConstant: boolean
      code: string
      value?: string
      resolved?: string
    }
    importClause?: {
      default?: string
      named: { specifier: string; binding: string }[]
      namespace?: string
    }
  }

  export type Options = { readonly resolveFrom?: string }
}

declare const parseImports: {
  (code: string, options?: parseImports.Options): Promise<
    IterableIterator<parseImports.Import>
  >
}

export = parseImports
