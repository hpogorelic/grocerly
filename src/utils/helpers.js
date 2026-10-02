import moment from 'moment'

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function formatDate(iso) {
  return moment(iso).format('DD.MM.YYYY HH:mm')
}

export function relative(iso) {
  return moment(iso).fromNow()
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
