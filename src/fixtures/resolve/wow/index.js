import { join } from 'path'

export const o = async () => {
  const fs = await import(`./d`)
  return fs.promises.readFile(join(__dirname, `./d`))
}
