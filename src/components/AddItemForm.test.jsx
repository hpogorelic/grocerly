import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AddItemForm from './AddItemForm'

test('submitting with an empty name does not call onAdd and marks the name input red', () => {
  const onAdd = vi.fn()
  const { container } = render(<AddItemForm onAdd={onAdd} />)
  fireEvent.submit(container.querySelector('form'))
  expect(onAdd).not.toHaveBeenCalled()
  expect(screen.getByPlaceholderText('item').style.borderColor).toBe('red')
})

test('submitting with a name calls onAdd and resets the fields', () => {
  const onAdd = vi.fn()
  const { container } = render(<AddItemForm onAdd={onAdd} />)
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: 'milk' } })
  fireEvent.change(screen.getByPlaceholderText('category'), { target: { value: 'dairy' } })
  fireEvent.submit(container.querySelector('form'))
  expect(onAdd).toHaveBeenCalledWith('milk', 1, 'dairy')
  expect(screen.getByPlaceholderText('item').value).toBe('')
  expect(screen.getByPlaceholderText('category').value).toBe('')
})

test('preview shows name, quantity and category', () => {
  const { container } = render(<AddItemForm onAdd={() => {}} />)
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: 'milk' } })
  fireEvent.change(screen.getByPlaceholderText('category'), { target: { value: 'dairy' } })
  const preview = container.querySelector('.preview')
  expect(preview.textContent).toBe('milk × 1 (dairy)')
})

test('renders category suggestions in the datalist', () => {
  const { container } = render(<AddItemForm onAdd={() => {}} categories={['dairy', 'bakery']} />)
  const values = Array.from(container.querySelectorAll('datalist option')).map((o) => o.getAttribute('value'))
  expect(values).toEqual(['dairy', 'bakery'])
})

test('preview shows typed HTML as text instead of rendering it', () => {
  const { container } = render(<AddItemForm onAdd={() => {}} />)
  const html = '<img src=x onerror=alert(1)>'
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: html } })
  const preview = container.querySelector('.preview')
  expect(preview.querySelector('img')).toBeNull()
  expect(preview.textContent).toBe(html + ' × 1')
})
