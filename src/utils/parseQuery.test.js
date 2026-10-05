import { parseQuery } from './parseQuery'

const milk = { name: 'Milk', qty: 2, done: false }
const eggs = { name: 'Eggs', qty: 12, done: true }

test('plain words become the text, joined by single spaces', () => {
  const q = parseQuery('  fresh    milk ')
  expect(q.text).toBe('fresh milk')
  expect(q.tests).toEqual([])
})

test('empty or blank input gives empty text and no tests', () => {
  expect(parseQuery('')).toEqual({ text: '', tests: [] })
  expect(parseQuery('   ')).toEqual({ text: '', tests: [] })
})

test('a word with a comparison operator becomes a test function, not text', () => {
  const q = parseQuery('qty>2')
  expect(q.text).toBe('')
  expect(q.tests).toHaveLength(1)
  expect(typeof q.tests[0]).toBe('function')
  expect(q.tests[0](milk)).toBe(false)
  expect(q.tests[0](eggs)).toBe(true)
})

test('supports >, <, >=, <= and == comparisons on item fields', () => {
  expect(parseQuery('qty>2').tests[0](eggs)).toBe(true)
  expect(parseQuery('qty<12').tests[0](eggs)).toBe(false)
  expect(parseQuery('qty<=2').tests[0](milk)).toBe(true)
  expect(parseQuery('qty>=12').tests[0](eggs)).toBe(true)
  expect(parseQuery('qty==2').tests[0](milk)).toBe(true)
  expect(parseQuery('qty==2').tests[0](eggs)).toBe(false)
  expect(parseQuery('done==true').tests[0](eggs)).toBe(true)
})

test('text words and comparison words are separated', () => {
  const q = parseQuery('milk qty>1 whole qty<5')
  expect(q.text).toBe('milk whole')
  expect(q.tests).toHaveLength(2)
  expect(q.tests.map((t) => t(milk))).toEqual([true, true])
  expect(q.tests.map((t) => t(eggs))).toEqual([true, false])
})

test('a comparison on an unknown field is ignored', () => {
  expect(parseQuery('price>1')).toEqual({ text: '', tests: [] })
  expect(parseQuery('constructor>1').tests).toEqual([])
})

test('a single "=" compares and does not mutate the item', () => {
  const item = { name: 'Milk', qty: 2 }
  const q = parseQuery('qty=7')
  expect(q.tests[0](item)).toBe(false)
  expect(item.qty).toBe(2)
  expect(parseQuery('qty=2').tests[0](item)).toBe(true)
})

test('malformed comparison words are ignored instead of throwing', () => {
  expect(parseQuery('>5')).toEqual({ text: '', tests: [] })
  expect(parseQuery('qty>').tests).toEqual([])
})

test('words with code in them are never executed', () => {
  expect(parseQuery('qty>alert(1)').tests[0](milk)).toBe(false)
  expect(parseQuery('name=Milk').tests[0](milk)).toBe(true)
})
