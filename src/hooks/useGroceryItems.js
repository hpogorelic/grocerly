import { useReducer, useState, useEffect, useMemo, useRef } from 'react'
import { SEED_URL, STORAGE_KEY, DEBUG } from '../config'
import { itemsReducer } from './itemsReducer'

const NO_ITEMS = []

// Loads the items from storage (or the seed), persists them on change and
// exposes the list mutations of itemsReducer through dispatch.
export function useGroceryItems() {
  const [items, dispatch] = useReducer(itemsReducer, NO_ITEMS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const savedItems = useRef(NO_ITEMS)

  // load from storage, or from the seed when storage is empty
  useEffect(function () {
    let cancelled = false
    let stored = null
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      stored = null
    }
    if (stored && stored.length) {
      dispatch({ type: 'load', items: stored })
      setLoading(false)
    } else {
      fetch(SEED_URL).then(function (r) {
        if (!r.ok) throw new Error(r.statusText)
        return r.json()
      }).then(function (data) {
        if (cancelled) return
        dispatch({ type: 'load', items: data })
        setLoading(false)
      }).catch(function (err) {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    }
    return function () { cancelled = true }
  }, [])

  // persist whenever the items change (not for the initial empty list)
  useEffect(function () {
    if (items === savedItems.current) return
    savedItems.current = items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    if (DEBUG) console.log('saved', items.length, 'items')
  }, [items])

  // the save time follows the items in the same render (null until the first load)
  const lastSaved = useMemo(function () {
    return items === NO_ITEMS ? null : new Date().toISOString()
  }, [items])

  return { items, loading, error, lastSaved, dispatch }
}
