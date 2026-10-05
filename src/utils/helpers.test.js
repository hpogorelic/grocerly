import { findDuplicates, categories, capitalize } from './helpers'

test('findDuplicates matches names case-insensitively and reports each first-seen spelling', () => {
  const items = [{ name: 'Milk' }, { name: 'milk' }, { name: 'Eggs' }]
  expect(findDuplicates(items)).toEqual(['Milk', 'milk'])
})

test('findDuplicates returns an empty list when names are unique', () => {
  expect(findDuplicates([{ name: 'a' }, { name: 'b' }])).toEqual([])
  expect(findDuplicates([])).toEqual([])
})

test('findDuplicates does not repeat a name that appears three times', () => {
  expect(findDuplicates([{ name: 'a' }, { name: 'a' }, { name: 'a' }])).toEqual(['a'])
})

test('categories returns the unique categories in first-seen order', () => {
  const items = [{ category: 'dairy' }, { category: 'bakery' }, { category: 'dairy' }]
  expect(categories(items)).toEqual(['dairy', 'bakery'])
})

test('categories keeps undefined for items without a category', () => {
  expect(categories([{ category: 'a' }, {}])).toEqual(['a', undefined])
  expect(categories([])).toEqual([])
})

test('capitalize upper-cases the first letter and tolerates empty input', () => {
  expect(capitalize('milk')).toBe('Milk')
  expect(capitalize('')).toBe('')
  expect(capitalize(undefined)).toBe('')
})
