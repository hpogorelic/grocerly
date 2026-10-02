import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import axios from 'axios'
import { SEED_URL, STORAGE_KEY, DEBUG } from './config'
import { deepClone, findDuplicates, categories } from './utils/helpers'
import { applyFilter, countByFilter } from './utils/filters'
import ItemList from './components/ItemList'
import AddItemForm from './components/AddItemForm'
import Stats from './components/Stats'
import SavedLabel from './components/SavedLabel'

const NO_ITEMS = []

function App() {
  const [items, setItems] = useState(NO_ITEMS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [filterArg, setFilterArg] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('addedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [showArchived, setShowArchived] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  const savedItems = useRef(NO_ITEMS)
  const highlightTimers = useRef([])

  // cancel any pending highlight timeouts on unmount
  useEffect(function () {
    const timers = highlightTimers.current
    return function () {
      timers.forEach(clearTimeout)
    }
  }, [])

  const handleAdd = useCallback(function (name, qty, category) {
    const id = 'i' + crypto.randomUUID()
    const item = {
      id: id,
      name: name,
      qty: parseInt(qty, 10) || 1,
      category: category || 'other',
      done: false,
      addedAt: new Date().toISOString()
    }
    setItems(function (current) {
      const next = deepClone(current)
      next.push(item)
      return next
    })
    const timers = highlightTimers.current
    timers.push(setTimeout(function () {
      setHighlightedId(id)
      timers.push(setTimeout(function () {
        setHighlightedId(function (current) { return current === id ? null : current })
      }, 800))
    }, 0))
  }, [])

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
      setItems(stored)
      setLoading(false)
    } else {
      axios.get(SEED_URL).then(function (res) {
        if (cancelled) return
        setItems(res.data)
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
    setLastSaved(new Date().toISOString())
    if (DEBUG) console.log('saved', items.length, 'items')
  }, [items])

  const visible = useMemo(function () {
    let list = applyFilter(items, filter, filterArg)
    if (search) {
      list = applyFilter(list, 'search', search)
    }
    list = [...list].sort(function (a, b) { return a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0 })
    if (sortDir === 'desc') list = list.reverse()
    return list
  }, [items, filter, filterArg, search, sortBy, sortDir])

  function handleToggle(id) {
    const next = deepClone(items)
    for (let i = 0; i < next.length; i++) {
      if (next[i].id === id) next[i].done = !next[i].done
    }
    setItems(next)
  }

  function handleRemove(id) {
    setItems(deepClone(items).filter(function (i) { return i.id !== id }))
  }

  function handleClearDone() {
    setItems(deepClone(items).filter(function (i) { return !i.done }))
  }

  function handleSearch(e) {
    setSearch(e.target.value)
  }

  function handleFilter(type, arg) {
    setFilter(type)
    setFilterArg(arg || null)
  }

  function handleSort(by) {
    if (sortBy === by) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(by)
      setSortDir('asc')
    }
  }

  if (loading) return <div className="app">Loading…</div>
  if (error) return <div className="app">Error: {error}</div>

  const dupes = findDuplicates(items)
  const cats = categories(items)
  const openCount = countByFilter(items, 'open')
  const doneCount = countByFilter(items, 'done')

  return (
    <div className="app">
      <h1>Grocerly</h1>
      <AddItemForm onAdd={handleAdd} categories={cats} />
      <div className="toolbar">
        <input placeholder="search" value={search} onChange={handleSearch} />
        <button onClick={function () { handleFilter('all') }}>All</button>
        <button onClick={function () { handleFilter('open') }}>Open</button>
        <button onClick={function () { handleFilter('done') }}>Done</button>
        <button onClick={function () { handleFilter('big') }}>Big</button>
        {cats.map(function (c) {
          return <button key={c} onClick={function () { handleFilter('category', c) }}>{c}</button>
        })}
        <button onClick={function () { handleSort('name') }}>Sort by name</button>
        <button onClick={function () { handleSort('addedAt') }}>Sort by date</button>
        <button onClick={handleClearDone}>Clear done</button>
        <button onClick={function () { setShowArchived(!showArchived) }}>{showArchived ? 'Hide' : 'Show'} archived</button>
      </div>
      {dupes.length > 0 && <div className="stats">Duplicates: {dupes.join(', ')}</div>}
      <Stats items={items} open={openCount} done={doneCount} />
      <ItemList items={visible} highlightedId={highlightedId} onToggle={handleToggle} onRemove={handleRemove} />
      {showArchived && <ItemList items={items.filter(function (i) { return i.done })} idPrefix="arch-" emptyText="Nothing archived." onToggle={handleToggle} onRemove={handleRemove} />}
      <SavedLabel lastSaved={lastSaved} />
    </div>
  )
}

export default App
// hotfix: highlight new item
