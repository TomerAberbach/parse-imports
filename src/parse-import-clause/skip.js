export const separatorRegex = /^(?:\s+|,)$/u

export const skipSeparators = (imported, i) => {
  while (i < imported.length && separatorRegex.test(imported[i])) {
    i++
  }

  return i
}

export const skipNonSeparators = (imported, i) => {
  while (i < imported.length && !separatorRegex.test(imported[i])) {
    i++
  }

  return i
}
