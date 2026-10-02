import React, { useState, useEffect } from 'react'
import { relative } from '../utils/helpers'
import { formatDate } from '../utils/format'

// owns the one-second tick that refreshes the relative "Saved … ago" text
function SavedLabel({ lastSaved }) {
  const [, setTick] = useState(0)

  useEffect(function () {
    const timer = setInterval(function () {
      setTick(function (t) { return t + 1 })
    }, 1000)
    return function () { clearInterval(timer) }
  }, [])

  return (
    <div className="stats">
      {lastSaved ? 'Saved ' + relative(lastSaved) + ' (' + formatDate(lastSaved) + ')' : 'Not saved yet'}
    </div>
  )
}

export default SavedLabel
