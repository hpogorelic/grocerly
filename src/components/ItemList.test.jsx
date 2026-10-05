import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ItemList from './ItemList'

const items = [
  { id: '1', name: 'milk', qty: 2, category: 'dairy', done: false, addedAt: new Date(2024, 10, 2, 9, 15).toISOString() },
  { id: '2', name: 'eggs', qty: 12, category: 'dairy', done: true, addedAt: new Date(2024, 10, 3, 9, 15).toISOString() }
]

test('renders all items with capitalized name, quantity, category and date', () => {
  const { container } = render(<ItemList items={items} onToggle={() => {}} onRemove={() => {}} />)
  expect(container.querySelectorAll('li').length).toBe(2)
  expect(screen.getByText('Milk')).toBeInTheDocument()
  expect(screen.getByText('12x')).toBeInTheDocument()
  expect(screen.getByText('02.11.2024')).toBeInTheDocument()
  expect(container.querySelector('#item-1')).not.toHaveClass('done')
  expect(container.querySelector('#item-2')).toHaveClass('done')
})

test('shows a placeholder when there are no items', () => {
  const { rerender } = render(<ItemList items={[]} />)
  expect(screen.getByText('Nothing to buy.')).toBeInTheDocument()
  rerender(<ItemList />)
  expect(screen.getByText('Nothing to buy.')).toBeInTheDocument()
})

test('toggle and remove call back with the item id', () => {
  const onToggle = vi.fn()
  const onRemove = vi.fn()
  render(<ItemList items={[items[0]]} onToggle={onToggle} onRemove={onRemove} />)
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByText('x'))
  expect(onToggle).toHaveBeenCalledWith('1')
  expect(onRemove).toHaveBeenCalledWith('1')
})

test('idPrefix changes the row id prefix', () => {
  const { container } = render(<ItemList items={[items[1]]} idPrefix="arch-" onToggle={() => {}} onRemove={() => {}} />)
  expect(container.querySelector('#arch-2')).not.toBeNull()
  expect(container.querySelector('#item-2')).toBeNull()
})

test('emptyText replaces the default placeholder', () => {
  const { rerender } = render(<ItemList items={[]} emptyText="Nothing archived." />)
  expect(screen.getByText('Nothing archived.')).toBeInTheDocument()
  rerender(<ItemList emptyText="Nothing archived." />)
  expect(screen.getByText('Nothing archived.')).toBeInTheDocument()
})
