// List mutations for the grocery items, as immutable updates.
export function itemsReducer(items, action) {
  switch (action.type) {
    case 'load':
      return action.items
    case 'add':
      return [...items, action.item]
    case 'toggle':
      return items.map(function (i) {
        return i.id === action.id ? { ...i, done: !i.done } : i
      })
    case 'remove':
      return items.filter(function (i) { return i.id !== action.id })
    case 'clearDone':
      return items.filter(function (i) { return !i.done })
    default:
      throw new Error('Unknown action: ' + action.type)
  }
}
