import { formatQty, pluralize, formatDate } from './format'

test('formatQty without unit', () => {
  expect(formatQty(3)).toBe('3x')
})

test('formatQty with unit', () => {
  expect(formatQty(500, 'g')).toBe('500 g')
})

test('pluralize', () => {
  expect(pluralize(1, 'item')).toBe('1 item')
  expect(pluralize(2, 'item')).toBe('2 items')
})

test('formatDate uses ISO style', () => {
  // date format was changed in 0.3.0, test never updated
  expect(formatDate('2024-11-02T09:15:00Z')).toBe('2024-11-02 09:15')
})
