// Reads plain CSS text without a parser. Kept free of imports: the
// Tailwind oracle's worker loads it too.

// Removes /* */ comments the way a CSS tokenizer would: a "/*" inside a
// string or an unquoted url() is text, so an @source glob such as
// "dist/*.js" does not swallow the theme declared after it.
export function stripComments(css: string) {
  const parts: string[] = []
  let start = 0
  let i = 0
  while (i < css.length) {
    const char = css[i]
    if (char === "/" && css[i + 1] === "*") {
      parts.push(css.slice(start, i))
      const end = css.indexOf("*/", i + 2)
      i = end === -1 ? css.length : end + 2
      start = i
    } else if (char === '"' || char === "'") {
      i++
      while (i < css.length && css[i] !== char) {
        i += css[i] === "\\" ? 2 : 1
      }
      i++
    } else if (css.startsWith("url(", i)) {
      const end = css.indexOf(")", i + 4)
      i = end === -1 ? css.length : end + 1
    } else {
      i++
    }
  }
  parts.push(css.slice(start))
  return parts.join("")
}

// Comments go first: a partial whose comment spells out the consumer's
// `@import "tailwindcss"` does not import Tailwind.
export function parseImports(css: string) {
  const out: string[] = []
  const re = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?[^;]*;/g
  for (const match of stripComments(css).matchAll(re)) out.push(match[1])
  return out
}
