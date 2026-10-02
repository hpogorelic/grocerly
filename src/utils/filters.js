const PREDICATES = {
  all: () => true,
  open: (item) => !item.done,
  done: (item) => item.done,
  category: (item, arg) => item.category === arg,
  search: (item, arg) => item.name.toLowerCase().indexOf((arg || '').toLowerCase()) !== -1,
  big: (item) => item.qty >= 5,
}

export function applyFilter(items, type, arg) {
  if (!Object.prototype.hasOwnProperty.call(PREDICATES, type)) return items
  const pred = PREDICATES[type]
  return items.filter((item) => pred(item, arg))
}

export function countByFilter(items, type, arg) {
  return applyFilter(items, type, arg).length
}
