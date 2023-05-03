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

import parseImportClause from '../src/parse-import-clause/index.js'

// Import syntax: https://www.ecma-international.org/ecma-262/#sec-imports
test.each([
  {
    input: `a`,
    output: {
      default: `a`,
      named: [],
      namespace: undefined,
    },
  },
  {
    input: `asdas`,
    output: {
      default: `asdas`,
      named: [],
      namespace: undefined,
    },
  },
  {
    input: `* as sdfs`,
    output: {
      default: undefined,
      named: [],
      namespace: `sdfs`,
    },
  },
  {
    input: `* as wow`,
    output: {
      default: undefined,
      named: [],
      namespace: `wow`,
    },
  },
  {
    input: `{}`,
    output: {
      default: undefined,
      named: [],
      namespace: undefined,
    },
  },
  {
    input: `{ }`,
    output: {
      default: undefined,
      named: [],
      namespace: undefined,
    },
  },
  {
    input: `{  }`,
    output: {
      default: undefined,
      named: [],
      namespace: undefined,
    },
  },
  {
    input: `{a}`,
    output: {
      default: undefined,
      named: [{ specifier: `a`, binding: `a` }],
      namespace: undefined,
    },
  },
  {
    input: `{ a}`,
    output: {
      default: undefined,
      named: [{ specifier: `a`, binding: `a` }],
      namespace: undefined,
    },
  },
  {
    input: `{ a }`,
    output: {
      default: undefined,
      named: [{ specifier: `a`, binding: `a` }],
      namespace: undefined,
    },
  },
  {
    input: `{a }`,
    output: {
      default: undefined,
      named: [{ specifier: `a`, binding: `a` }],
      namespace: undefined,
    },
  },
  {
    input: `{  asd    }`,
    output: {
      default: undefined,
      named: [{ specifier: `asd`, binding: `asd` }],
      namespace: undefined,
    },
  },
  {
    input: `{  asd   as y   }`,
    output: {
      default: undefined,
      named: [{ specifier: `asd`, binding: `y` }],
      namespace: undefined,
    },
  },
  {
    input: `{  asd   as y, x   }`,
    output: {
      default: undefined,
      named: [
        { specifier: `asd`, binding: `y` },
        { specifier: `x`, binding: `x` },
      ],
      namespace: undefined,
    },
  },
  {
    input: `{ m, asd   as y, x, sdf, esd as jsd   }`,
    output: {
      default: undefined,
      named: [
        { specifier: `m`, binding: `m` },
        { specifier: `asd`, binding: `y` },
        { specifier: `x`, binding: `x` },
        { specifier: `sdf`, binding: `sdf` },
        { specifier: `esd`, binding: `jsd` },
      ],
      namespace: undefined,
    },
  },
  {
    input: `{m,asd as y,x,sdf,esd as jsd}`,
    output: {
      default: undefined,
      named: [
        { specifier: `m`, binding: `m` },
        { specifier: `asd`, binding: `y` },
        { specifier: `x`, binding: `x` },
        { specifier: `sdf`, binding: `sdf` },
        { specifier: `esd`, binding: `jsd` },
      ],
      namespace: undefined,
    },
  },
  {
    input: `wow, {m,asd as y,x,sdf,esd as jsd}`,
    output: {
      default: `wow`,
      named: [
        { specifier: `m`, binding: `m` },
        { specifier: `asd`, binding: `y` },
        { specifier: `x`, binding: `x` },
        { specifier: `sdf`, binding: `sdf` },
        { specifier: `esd`, binding: `jsd` },
      ],
      namespace: undefined,
    },
  },
  {
    input: `wow   , {m,asd as y,x,sdf,esd as jsd}`,
    output: {
      default: `wow`,
      named: [
        { specifier: `m`, binding: `m` },
        { specifier: `asd`, binding: `y` },
        { specifier: `x`, binding: `x` },
        { specifier: `sdf`, binding: `sdf` },
        { specifier: `esd`, binding: `jsd` },
      ],
      namespace: undefined,
    },
  },
  {
    input: `wow   , * as    g`,
    output: {
      default: `wow`,
      named: [],
      namespace: `g`,
    },
  },
])(`parseImportClause($input) = $output`, ({ input, output }) => {
  const parsedImportClause = parseImportClause(input)

  expect(parsedImportClause).toStrictEqual(output)
})
