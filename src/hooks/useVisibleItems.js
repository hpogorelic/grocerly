import { useMemo } from 'react'
import { applyFilter } from '../utils/filters'
import { parseQuery } from '../utils/parseQuery'

// The filtered, searched and sorted list of items to display.
export function useVisibleItems(items, { filter, arg, search, sortBy, sortDir }) {
  return useMemo(function () {
    let list = applyFilter(items, filter, arg)
    if (search) {
      const query = parseQuery(search)
      if (query.text) list = applyFilter(list, 'search', query.text)
      query.tests.forEach(function (test) { list = list.filter(test) })
    }
    list = [...list].sort(function (a, b) { return a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0 })
    if (sortDir === 'desc') list = list.reverse()
    return list
  }, [items, filter, arg, search, sortBy, sortDir])
}
