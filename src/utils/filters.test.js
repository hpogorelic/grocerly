import { applyFilter, countByFilter } from './filters'

const items = [
  { id: '1', name: 'Milk', qty: 2, category: 'dairy', done: false },
  { id: '2', name: 'Eggs', qty: 12, category: 'dairy', done: true },
  { id: '3', name: 'Bread', qty: 1, category: 'bakery', done: false }
]

test('open filter', () => {
  expect(applyFilter(items, 'open').map((i) => i.id)).toEqual(['1', '3'])
})

test('category filter', () => {
  expect(applyFilter(items, 'category', 'dairy').length).toBe(2)
})

test('search filter matches names case-insensitively by substring', () => {
  expect(applyFilter(items, 'search', 'BR').map((i) => i.id)).toEqual(['3'])
  expect(applyFilter(items, 'search', 'i').map((i) => i.id)).toEqual(['1'])
})

test('search filter without an argument matches everything', () => {
  expect(applyFilter(items, 'search').length).toBe(3)
})

test('big filter keeps items with quantity of 5 or more', () => {
  expect(applyFilter(items, 'big').map((i) => i.id)).toEqual(['2'])
})

test('done and all filters', () => {
  expect(applyFilter(items, 'done').map((i) => i.id)).toEqual(['2'])
  const all = applyFilter(items, 'all')
  expect(all).toEqual(items)
  expect(all).not.toBe(items)
})

test('unknown filter type returns the same array', () => {
  expect(applyFilter(items, 'nope')).toBe(items)
})

test('countByFilter counts per filter type', () => {
  expect(countByFilter(items, 'all')).toBe(3)
  expect(countByFilter(items, 'open')).toBe(2)
  expect(countByFilter(items, 'done')).toBe(1)
  expect(countByFilter(items, 'category', 'dairy')).toBe(2)
  expect(countByFilter(items, 'search', 'MILK')).toBe(1)
  expect(countByFilter(items, 'big')).toBe(1)
})

test('countByFilter with an unknown type counts all items', () => {
  expect(countByFilter(items, 'nope')).toBe(3)
})
