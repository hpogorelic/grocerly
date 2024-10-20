export function applyFilter(items, type, arg) {
  var out = []
  switch (type) {
    case 'all':
      for (var i = 0; i < items.length; i++) out.push(items[i])
      break
    case 'open':
      for (var i = 0; i < items.length; i++) if (!items[i].done) out.push(items[i])
      break
    case 'done':
      for (var i = 0; i < items.length; i++) if (items[i].done) out.push(items[i])
      break
    case 'category':
      for (var i = 0; i < items.length; i++) if (items[i].category === arg) out.push(items[i])
      break
    case 'search':
      for (var i = 0; i < items.length; i++) if (items[i].name.toLowerCase().indexOf((arg || '').toLowerCase()) !== -1) out.push(items[i])
      break
    case 'big':
      for (var i = 0; i < items.length; i++) if (items[i].qty >= 5) out.push(items[i])
      break
    default:
      return items
  }
  return out
}

export function countByFilter(items, type, arg) {
  var n = 0
  switch (type) {
    case 'all':
      n = items.length
      break
    case 'open':
      for (var i = 0; i < items.length; i++) if (!items[i].done) n++
      break
    case 'done':
      for (var i = 0; i < items.length; i++) if (items[i].done) n++
      break
    case 'category':
      for (var i = 0; i < items.length; i++) if (items[i].category === arg) n++
      break
    case 'search':
      for (var i = 0; i < items.length; i++) if (items[i].name.toLowerCase().indexOf((arg || '').toLowerCase()) !== -1) n++
      break
    case 'big':
      for (var i = 0; i < items.length; i++) if (items[i].qty >= 5) n++
      break
    default:
      n = items.length
  }
  return n
}
