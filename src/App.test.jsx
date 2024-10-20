import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the heading', async () => {
  localStorage.setItem('grocerly-items', JSON.stringify([
    { id: 'x', name: 'Tea', qty: 1, category: 'pantry', done: false, addedAt: '2024-11-01T10:00:00Z' }
  ]))
  render(<App />)
  expect(await screen.findByText('Grocerly')).toBeInTheDocument()
  expect(screen.getByText('Tea')).toBeInTheDocument()
})
