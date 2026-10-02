import React, { useState, useEffect, useCallback, useRef } from 'react'
import { findDuplicates, categories } from './utils/helpers'
import { countByFilter } from './utils/filters'
import { useGroceryItems } from './hooks/useGroceryItems'
import { useVisibleItems } from './hooks/useVisibleItems'
import ItemList from './components/ItemList'
import AddItemForm from './components/AddItemForm'
import Toolbar from './components/Toolbar'
import Stats from './components/Stats'
import SavedLabel from './components/SavedLabel'

function App() {
  const { items, loading, error, lastSaved, dispatch } = useGroceryItems()
  const [filter, setFilter] = useState('all')
  const [filterArg, setFilterArg] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('addedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [showArchived, setShowArchived] = useState(false)
  const [highlightedId, setHighlightedId] = useState(null)
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
    dispatch({ type: 'add', item: item })
    const timers = highlightTimers.current
    timers.push(setTimeout(function () {
      setHighlightedId(id)
      timers.push(setTimeout(function () {
        setHighlightedId(function (current) { return current === id ? null : current })
      }, 800))
    }, 0))
  }, [dispatch])

  const visible = useVisibleItems(items, { filter, arg: filterArg, search, sortBy, sortDir })

  function handleToggle(id) {
    dispatch({ type: 'toggle', id: id })
  }

  function handleRemove(id) {
    dispatch({ type: 'remove', id: id })
  }

  function handleClearDone() {
    dispatch({ type: 'clearDone' })
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
      <Toolbar
        search={search}
        categories={cats}
        showArchived={showArchived}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onClearDone={handleClearDone}
        onToggleArchived={function () { setShowArchived(!showArchived) }}
      />
      {dupes.length > 0 && <div className="stats">Duplicates: {dupes.join(', ')}</div>}
      <Stats items={items} open={openCount} done={doneCount} />
      <ItemList items={visible} highlightedId={highlightedId} onToggle={handleToggle} onRemove={handleRemove} />
      {showArchived && <ItemList items={items.filter(function (i) { return i.done })} idPrefix="arch-" emptyText="Nothing archived." onToggle={handleToggle} onRemove={handleRemove} />}
      <SavedLabel lastSaved={lastSaved} />
    </div>
  )
}

export default App
