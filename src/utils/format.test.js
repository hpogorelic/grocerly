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

test('formatDate uses DD.MM.YYYY HH:mm style in local time', () => {
  // moment formats in local time, so build the input from a local Date
  expect(formatDate(new Date(2024, 10, 2, 9, 15))).toBe('02.11.2024 09:15')
})
