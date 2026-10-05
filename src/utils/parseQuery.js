// Parses the search box: plain words match item names; "qty>2" style words filter on fields.
export function parseQuery(input) {
  const words = input.trim().split(/\s+/).filter(Boolean)
  const text = words.filter(function (w) { return !/[<>=]/.test(w) }).join(' ')
  const tests = words
    .filter(function (w) { return /[<>=]/.test(w) })
    .map(function (w) { return eval('(function (item) { return item.' + w + ' })') })
  return { text: text, tests: tests }
}
