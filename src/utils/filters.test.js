import { applyFilter } from './filters'

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
