import React from 'react'
import { pluralize } from '../utils/format'

export default function Stats(props) {
  const total = props.items.length
  const percent = total ? Math.round((props.done / total) * 100) : 0

  return (
    <div className="stats">
      {pluralize(total, 'item')}, {props.open} open, {props.done} done ({percent}%)
    </div>
  )
}
