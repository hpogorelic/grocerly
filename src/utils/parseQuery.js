// Parses the search box: plain words match item names; "qty>2" style words filter on fields.
const FIELDS = ['qty', 'name', 'category', 'done']
const WORD = /^(\w+)(<=|>=|==|=|<|>)(.+)$/
const OPS = {
  '=': function (a, b) { return a == b },
  '==': function (a, b) { return a == b },
  '<': function (a, b) { return a < b },
  '>': function (a, b) { return a > b },
  '<=': function (a, b) { return a <= b },
  '>=': function (a, b) { return a >= b },
}

// Returns a predicate for a comparison word, or null when the word is malformed or names an unknown field.
function parseComparison(w) {
  const m = WORD.exec(w)
  if (!m || !FIELDS.includes(m[1])) return null
  const field = m[1]
  const op = OPS[m[2]]
  const raw = m[3]
  const val = field === 'qty' ? Number(raw) : field === 'done' ? raw === 'true' : raw
  return function (item) { return op(item[field], val) }
}

export function parseQuery(input) {
  const words = input.trim().split(/\s+/).filter(Boolean)
  const text = words.filter(function (w) { return !/[<>=]/.test(w) }).join(' ')
  const tests = words
    .filter(function (w) { return /[<>=]/.test(w) })
    .map(parseComparison)
    .filter(Boolean)
  return { text: text, tests: tests }
}
