import React from 'react'

export default function Toolbar(props) {
  const { search, categories, showArchived, onSearch, onFilter, onSort, onClearDone, onToggleArchived } = props

  return (
    <div className="toolbar">
      <input placeholder="search" value={search} onChange={onSearch} />
      <button onClick={function () { onFilter('all') }}>All</button>
      <button onClick={function () { onFilter('open') }}>Open</button>
      <button onClick={function () { onFilter('done') }}>Done</button>
      <button onClick={function () { onFilter('big') }}>Big</button>
      {categories.map(function (c) {
        return <button key={c} onClick={function () { onFilter('category', c) }}>{c}</button>
      })}
      <button onClick={function () { onSort('name') }}>Sort by name</button>
      <button onClick={function () { onSort('addedAt') }}>Sort by date</button>
      <button onClick={onClearDone}>Clear done</button>
      <button onClick={onToggleArchived}>{showArchived ? 'Hide' : 'Show'} archived</button>
    </div>
  )
}
