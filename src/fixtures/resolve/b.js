import ahem, { x, y, z as b } from './a'
import { o } from './wow'
import c from './c'
import { init } from 'es-module-lexer'

export default async function () {
  console.log(`hi`)
  console.log(x)
  console.log(y)
  console.log(b)
  console.log(ahem)
  console.log(await o())
  console.log(c)
  await init
}
