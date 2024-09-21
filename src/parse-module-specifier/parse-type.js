import module from 'node:module'

const builtinModules = new Set(module.builtinModules)

const parseType = moduleSpecifier => {
  if (moduleSpecifier.length === 0) {
    return `invalid`
  }

  if (moduleSpecifier.startsWith(`/`)) {
    return `absolute`
  }

  if (moduleSpecifier.startsWith(`.`)) {
    return `relative`
  }

  if (builtinModules.has(moduleSpecifier)) {
    return `builtin`
  }

  return `package`
}

export default parseType
