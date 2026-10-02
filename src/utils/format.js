import moment from 'moment'

export function formatDate(iso) {
  return moment(iso).format('DD.MM.YYYY HH:mm')
}

export function formatQty(qty, unit) {
  if (unit) return qty + ' ' + unit
  return qty + 'x'
}

export function pluralize(n, word) {
  return n === 1 ? n + ' ' + word : n + ' ' + word + 's'
}
