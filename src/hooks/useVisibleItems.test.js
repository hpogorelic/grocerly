import { renderHook } from '@testing-library/react'
import { useVisibleItems } from './useVisibleItems'

const items = [
  { id: '1', name: 'Milk', qty: 2, category: 'dairy', done: false },
  { id: '2', name: 'Eggs', qty: 12, category: 'dairy', done: true },
  { id: '3', name: 'Bread', qty: 1, category: 'bakery', done: false },
  { id: '4', name: 'Apples', qty: 6, category: 'produce', done: false }
]

const base = { filter: 'all', arg: undefined, search: '', sortBy: 'name', sortDir: 'asc' }

function visible(opts, list = items) {
  const { result } = renderHook(() => useVisibleItems(list, { ...base, ...opts }))
  return result.current.map((i) => i.id)
}

test('sorts ascending by the sortBy field', () => {
  expect(visible({})).toEqual(['4', '3', '2', '1'])
  expect(visible({ sortBy: 'qty' })).toEqual(['3', '1', '4', '2'])
})

test('sortDir desc reverses the sorted order', () => {
  expect(visible({ sortDir: 'desc' })).toEqual(['1', '2', '3', '4'])
  expect(visible({ sortBy: 'qty', sortDir: 'desc' })).toEqual(['2', '4', '1', '3'])
})

test('any sortDir other than desc sorts ascending', () => {
  expect(visible({ sortDir: 'sideways' })).toEqual(['4', '3', '2', '1'])
})

test('applies the filter and its argument', () => {
  expect(visible({ filter: 'open' })).toEqual(['4', '3', '1'])
  expect(visible({ filter: 'done' })).toEqual(['2'])
  expect(visible({ filter: 'category', arg: 'dairy' })).toEqual(['2', '1'])
})

test('an unknown filter keeps every item', () => {
  expect(visible({ filter: 'nope' })).toEqual(['4', '3', '2', '1'])
})

test('plain search words match names case-insensitively', () => {
  expect(visible({ search: 'MIL' })).toEqual(['1'])
  expect(visible({ search: 'e' })).toEqual(['4', '3', '2'])
})

test('a field comparison in the search filters on that field', () => {
  expect(visible({ search: 'qty>2' })).toEqual(['4', '2'])
  expect(visible({ search: 'qty<=2' })).toEqual(['3', '1'])
})

test('text and comparison words combine, and combine with the filter', () => {
  expect(visible({ search: 'e qty>5' })).toEqual(['4', '2'])
  expect(visible({ search: 'e qty>5', filter: 'open' })).toEqual(['4'])
  expect(visible({ search: 'qty>1 qty<10' })).toEqual(['4', '1'])
})

test('an empty search leaves the filtered list unchanged', () => {
  expect(visible({ search: '' })).toEqual(['4', '3', '2', '1'])
})

test('does not mutate the input array', () => {
  const copy = [...items]
  visible({ sortDir: 'desc' }, copy)
  expect(copy).toEqual(items)
})

test('returns the same result array while the inputs are unchanged', () => {
  const opts = { ...base, sortBy: 'qty' }
  const { result, rerender } = renderHook(() => useVisibleItems(items, opts))
  const first = result.current
  rerender()
  expect(result.current).toBe(first)
})

test('recomputes when the items change', () => {
  const opts = { ...base }
  const { result, rerender } = renderHook(({ list }) => useVisibleItems(list, opts), {
    initialProps: { list: items }
  })
  expect(result.current).toHaveLength(4)
  rerender({ list: items.slice(0, 2) })
  expect(result.current.map((i) => i.id)).toEqual(['2', '1'])
})
