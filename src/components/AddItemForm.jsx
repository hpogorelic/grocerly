import React, { useState, useEffect, useRef } from 'react'
import $ from 'jquery'
import { emit } from '../utils/bus'

export default function AddItemForm(props) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [category, setCategory] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    $(formRef.current).find('input').first().focus()
    $(formRef.current).hide().fadeIn(300)
  }, [])

  function submit(e) {
    e.preventDefault()
    if (!name) {
      $(formRef.current).find('input').first().css('border-color', 'red')
      return
    }
    props.onAdd(name, qty, category)
    emit('form:submitted', { name: name })
    setName('')
    setQty(1)
    setCategory('')
  }

  return (
    <form ref={formRef} onSubmit={submit} className="add-form">
      <input placeholder="item" value={name} onChange={(e) => setName(e.target.value)} />
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
