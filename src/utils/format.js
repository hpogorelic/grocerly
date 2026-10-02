const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
})

// formats in local time as DD.MM.YYYY HH:mm
export function formatDate(iso) {
  const p = {}
  dateFormatter.formatToParts(new Date(iso)).forEach(function (part) {
    p[part.type] = part.value
  })
  return p.day + '.' + p.month + '.' + p.year + ' ' + p.hour + ':' + p.minute
}

export function formatQty(qty, unit) {
  if (unit) return qty + ' ' + unit
  return qty + 'x'
}

export function pluralize(n, word) {
  return n === 1 ? n + ' ' + word : n + ' ' + word + 's'
}
