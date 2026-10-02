import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ArchivedList from './ArchivedList'

const items = [
  { id: '1', name: 'milk', qty: 2, category: 'dairy', done: false, addedAt: new Date(2024, 10, 2, 9, 15).toISOString() },
  { id: '2', name: 'eggs', qty: 12, category: 'dairy', done: true, addedAt: new Date(2024, 10, 3, 9, 15).toISOString() }
]

test('shows only done items', () => {
  const { container } = render(<ArchivedList items={items} onToggle={() => {}} onRemove={() => {}} />)
  expect(container.querySelectorAll('li').length).toBe(1)
  expect(screen.getByText('Eggs')).toBeInTheDocument()
  expect(screen.queryByText('Milk')).toBeNull()
  expect(container.querySelector('#arch-2')).not.toBeNull()
})

test('shows a placeholder when nothing is done or items are missing', () => {
  const { rerender } = render(<ArchivedList items={[items[0]]} />)
  expect(screen.getByText('Nothing archived.')).toBeInTheDocument()
  rerender(<ArchivedList />)
  expect(screen.getByText('Nothing archived.')).toBeInTheDocument()
})

test('toggle and remove call back with the item id', () => {
  const onToggle = vi.fn()
  const onRemove = vi.fn()
  render(<ArchivedList items={items} onToggle={onToggle} onRemove={onRemove} />)
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByText('x'))
  expect(onToggle).toHaveBeenCalledWith('2')
  expect(onRemove).toHaveBeenCalledWith('2')
})
