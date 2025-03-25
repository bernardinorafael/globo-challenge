export function capitalize(v: string, ignorePreposition?: boolean): string {
  if (!v) return ""

  if (!ignorePreposition) {
    return v.charAt(0).toUpperCase().concat(v.slice(1))
  }

  const prepositions = ["de", "da", "do", "dos", "das", "e", "ou", "a"]

  return v
    .split(" ")
    .map((word, index, array) => {
      const isPreposition = prepositions.includes(word.toLowerCase())
      const isFirstOrLastWord = index === 0 || index === array.length - 1

      if (isPreposition && !isFirstOrLastWord) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(" ")
}

export function truncate(v: string, max: number): string {
  if (v.length <= max) {
    return v
  }
  return v.slice(0, max).concat("...")
}
