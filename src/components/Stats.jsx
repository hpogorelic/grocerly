import React, { useState, useEffect } from 'react'
import { pluralize } from '../utils/format'

export default function Stats(props) {
  const [total, setTotal] = useState(0)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    setTotal(props.items.length)
  }, [props.items])

  useEffect(() => {
    if (total > 0) setPercent(Math.round((props.done / total) * 100))
    else setPercent(0)
  }, [total, props.done])

  return (
    <div className="stats">
      {pluralize(total, 'item')}, {props.open} open, {props.done} done ({percent}%)
    </div>
  )
}
