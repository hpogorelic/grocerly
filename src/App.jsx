import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import $ from 'jquery'
import { SEED_URL, STORAGE_KEY, DEBUG } from './config'
import { deepClone, findDuplicates, categories, relative } from './utils/helpers'
import { applyFilter, countByFilter } from './utils/filters'
import { formatDate } from './utils/format'
import { on, off, emit } from './utils/bus'
import ItemList from './components/ItemList'
import ArchivedList from './components/ArchivedList'
import AddItemForm from './components/AddItemForm'
import Stats from './components/Stats'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      loading: true,
      error: null,
      filter: 'all',
      filterArg: null,
      search: '',
      sortBy: 'addedAt',
      sortDir: 'desc',
      showArchived: false,
      lastSaved: null,
      tick: 0
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleClearDone = this.handleClearDone.bind(this)
    this.handleBusAdd = this.handleBusAdd.bind(this)
    this.toggleArchived = this.toggleArchived.bind(this)
  }

  componentDidMount() {
    var self = this
    var stored = null
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      stored = null
    }
    if (stored && stored.length) {
      self.setState({ items: stored, loading: false })
    } else {
      axios.get(SEED_URL).then(function (res) {
        self.setState({ items: res.data, loading: false })
      }).catch(function (err) {
        self.setState({ error: err.message, loading: false })
      })
    }
    on('item:add', this.handleBusAdd)
    this.timer = setInterval(function () {
      self.setState({ tick: self.state.tick + 1 })
    }, 1000)
  }

  componentWillUnmount() {
    off('item:add', this.handleBusAdd)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items !== this.state.items) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.items))
      this.setState({ lastSaved: new Date().toISOString() })
      if (DEBUG) console.log('saved', this.state.items.length, 'items')
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // nothing here yet
  }

  handleBusAdd(item) {
    this.handleAdd(item.name, item.qty, item.category)
  }

  handleAdd(name, qty, category) {
    var items = deepClone(this.state.items)
    var id = 'i' + crypto.randomUUID()
    items.push({
      id: id,
      name: name,
      qty: parseInt(qty, 10) || 1,
      category: category || 'other',
      done: false,
      addedAt: new Date().toISOString()
    })
    this.setState({ items: items })
    emit('item:added', id)
    setTimeout(function () {
      $('#item-' + id).addClass('highlight')
      setTimeout(function () { $('#item-' + id).removeClass('highlight') }, 800)
    }, 0)
  }

  handleToggle(id) {
    var items = deepClone(this.state.items)
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) items[i].done = !items[i].done
    }
    this.setState({ items: items })
  }

  handleRemove(id) {
    var items = deepClone(this.state.items)
    var out = []
    for (var i = 0; i < items.length; i++) {
      if (items[i].id !== id) out.push(items[i])
    }
    this.setState({ items: out })
  }

  handleClearDone() {
    var items = deepClone(this.state.items)
    var out = []
    for (var i = 0; i < items.length; i++) {
      if (!items[i].done) out.push(items[i])
    }
    this.setState({ items: out })
  }

  handleSearch(e) {
    this.setState({ search: e.target.value })
  }

  handleFilter(type, arg) {
    this.setState({ filter: type, filterArg: arg || null })
  }

  handleSort(by) {
    if (this.state.sortBy === by) {
      this.setState({ sortDir: this.state.sortDir === 'asc' ? 'desc' : 'asc' })
    } else {
      this.setState({ sortBy: by, sortDir: 'asc' })
    }
  }

  toggleArchived() {
    this.setState({ showArchived: !this.state.showArchived })
  }

  getVisibleItems() {
    var items = this.state.items
    items = applyFilter(items, this.state.filter, this.state.filterArg)
    if (this.state.search) {
      items = applyFilter(items, 'search', this.state.search)
    }
    var by = this.state.sortBy
    var dir = this.state.sortDir
    items = _.sortBy(items, function (i) { return i[by] })
    if (dir === 'desc') items = items.reverse()
    return items
  }

  render() {
    var self = this
    if (this.state.loading) return <div className="app">Loading…</div>
    if (this.state.error) return <div className="app">Error: {this.state.error}</div>

    var visible = this.getVisibleItems()
    var dupes = findDuplicates(this.state.items)
    var cats = categories(this.state.items)
    var openCount = countByFilter(this.state.items, 'open')
    var doneCount = countByFilter(this.state.items, 'done')

    return (
      <div className="app">
        <h1>Grocerly</h1>
        <AddItemForm onAdd={this.handleAdd} categories={cats} />
        <div className="toolbar">
          <input placeholder="search" value={this.state.search} onChange={this.handleSearch} />
          <button onClick={function () { self.handleFilter('all') }}>All</button>
          <button onClick={function () { self.handleFilter('open') }}>Open</button>
          <button onClick={function () { self.handleFilter('done') }}>Done</button>
          <button onClick={function () { self.handleFilter('big') }}>Big</button>
          {cats.map(function (c) {
            return <button key={c} onClick={function () { self.handleFilter('category', c) }}>{c}</button>
          })}
          <button onClick={function () { self.handleSort('name') }}>Sort by name</button>
          <button onClick={function () { self.handleSort('addedAt') }}>Sort by date</button>
          <button onClick={this.handleClearDone}>Clear done</button>
          <button onClick={this.toggleArchived}>{this.state.showArchived ? 'Hide' : 'Show'} archived</button>
        </div>
        {dupes.length > 0 && <div className="stats">Duplicates: {dupes.join(', ')}</div>}
        <Stats items={this.state.items} open={openCount} done={doneCount} />
        <ItemList items={visible} onToggle={this.handleToggle} onRemove={this.handleRemove} sortBy={this.state.sortBy} sortDir={this.state.sortDir} search={this.state.search} filter={this.state.filter} />
        {this.state.showArchived && <ArchivedList items={this.state.items} onToggle={this.handleToggle} onRemove={this.handleRemove} sortBy={this.state.sortBy} sortDir={this.state.sortDir} />}
        <div className="stats">
          {this.state.lastSaved ? 'Saved ' + relative(this.state.lastSaved) + ' (' + formatDate(this.state.lastSaved) + ')' : 'Not saved yet'}
        </div>
      </div>
    )
  }
}

export default App
// hotfix: highlight new item
