import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'

export default function AddItemForm(props) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [category, setCategory] = useState('')
  const [error, setError] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  function submit(e) {
    e.preventDefault()
    if (!name) {
      setError(true)
      return
    }
    setError(false)
    props.onAdd(name, qty, category)
    setName('')
    setQty(1)
    setCategory('')
  }

  return (
    <form onSubmit={submit} className="add-form">
      <input ref={nameRef} className={classNames({ invalid: error })} placeholder="item" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
      <input placeholder="category" value={category} list="cats" onChange={(e) => setCategory(e.target.value)} />
      <datalist id="cats">
        {(props.categories || []).map((c) => <option key={c} value={c} />)}
      </datalist>
      <button type="submit">Add</button>
      <div className="preview"><b>{name}</b> × {qty}{category ? ` (${category})` : ''}</div>
    </form>
  )
}
