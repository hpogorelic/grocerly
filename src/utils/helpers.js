const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

// singular forms read 'a minute ago' / 'in an hour', the wording moment used
const ARTICLES = { minute: 'a minute', hour: 'an hour', day: 'a day', month: 'a month', year: 'a year' }

function relativeText(value, unit) {
  if (Math.abs(value) === 1) {
    return value < 0 ? ARTICLES[unit] + ' ago' : 'in ' + ARTICLES[unit]
  }
  return relativeFormatter.format(value, unit)
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// thresholds follow moment's fromNow()
export function relative(iso) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  const sign = diff > 0 ? 1 : -1
  const secs = Math.abs(diff)
  if (secs < 45) return sign < 0 ? 'a few seconds ago' : 'in a few seconds'
  if (secs < 90) return relativeText(sign, 'minute')
  const minutes = Math.round(secs / 60)
  if (minutes < 45) return relativeText(sign * minutes, 'minute')
  if (minutes < 90) return relativeText(sign, 'hour')
  const hours = Math.round(secs / 3600)
  if (hours < 22) return relativeText(sign * hours, 'hour')
  if (hours < 36) return relativeText(sign, 'day')
  const days = Math.round(secs / 86400)
  if (days < 26) return relativeText(sign * days, 'day')
  if (days < 45) return relativeText(sign, 'month')
  if (days < 320) return relativeText(sign * Math.round(days / 30.4), 'month')
  if (days < 548) return relativeText(sign, 'year')
  return relativeText(sign * Math.round(days / 365), 'year')
}

export function categories(items) {
  return [...new Set(items.map(function (i) { return i.category }))]
}

export function findDuplicates(items) {
  var dupes = []
  for (var i = 0; i < items.length; i++) {
    for (var j = 0; j < items.length; j++) {
      if (i !== j && items[i].name.toLowerCase() === items[j].name.toLowerCase()) {
        if (dupes.indexOf(items[i].name) === -1) dupes.push(items[i].name)
      }
    }
  }
  return dupes
}

export function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
