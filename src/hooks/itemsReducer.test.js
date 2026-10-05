import { itemsReducer } from './itemsReducer'

const milk = { id: '1', name: 'Milk', qty: 2, category: 'dairy', done: false }
const eggs = { id: '2', name: 'Eggs', qty: 12, category: 'dairy', done: true }

function fresh() {
  return [{ ...milk }, { ...eggs }]
}

test('load replaces the list with the given items', () => {
  const loaded = [{ ...milk }]
  expect(itemsReducer(fresh(), { type: 'load', items: loaded })).toBe(loaded)
})

test('add appends the item at the end', () => {
  const item = { id: '3', name: 'Bread', qty: 1, category: 'bakery', done: false }
  expect(itemsReducer(fresh(), { type: 'add', item })).toEqual([milk, eggs, item])
})

test('toggle flips done for the matching id only', () => {
  expect(itemsReducer(fresh(), { type: 'toggle', id: '1' })).toEqual([{ ...milk, done: true }, eggs])
  expect(itemsReducer(fresh(), { type: 'toggle', id: '2' })).toEqual([milk, { ...eggs, done: false }])
})

test('remove drops the item with the given id', () => {
  expect(itemsReducer(fresh(), { type: 'remove', id: '1' })).toEqual([eggs])
})

test('clearDone drops every done item', () => {
  expect(itemsReducer(fresh(), { type: 'clearDone' })).toEqual([milk])
})

test('an unknown action throws', () => {
  expect(() => itemsReducer(fresh(), { type: 'nope' })).toThrow('Unknown action: nope')
})

test('no action mutates the input array or its items', () => {
  const actions = [
    { type: 'add', item: { id: '3', name: 'Bread', qty: 1, category: 'bakery', done: false } },
    { type: 'toggle', id: '1' },
    { type: 'remove', id: '1' },
    { type: 'clearDone' }
  ]
  actions.forEach(function (action) {
    const input = fresh()
    input.forEach(Object.freeze)
    Object.freeze(input)
    const snapshot = JSON.parse(JSON.stringify(input))
    const out = itemsReducer(input, action)
    expect(out).not.toBe(input)
    expect(input).toEqual(snapshot)
  })
})
