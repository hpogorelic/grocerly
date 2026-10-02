import React from 'react'
import classNames from 'classnames'
import { formatDate, formatQty } from '../utils/format'
import { capitalize } from '../utils/helpers'

export default function ItemList(props) {
  var items = props.items || []
  if (items.length === 0) return <p>Nothing to buy.</p>
  return (
    <ul>
      {items.map(function (item) {
        return (
          <li key={item.id} id={'item-' + item.id} className={classNames('item', { done: item.done, highlight: item.id === props.highlightedId })}>
            <input type="checkbox" checked={item.done} onChange={function () { props.onToggle(item.id) }} />
            <span>{capitalize(item.name)}</span>
            <span>{formatQty(item.qty)}</span>
            <span>{item.category}</span>
            <span title={formatDate(item.addedAt)}>{formatDate(item.addedAt).slice(0, 10)}</span>
            <button onClick={function () { props.onRemove(item.id) }}>x</button>
          </li>
        )
      })}
    </ul>
  )
}
