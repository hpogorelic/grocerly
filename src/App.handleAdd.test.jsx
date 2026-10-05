import React from 'react'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import App from './App'

const KEY = 'grocerly-items'

const EXISTING = [
  { id: 'a1', name: 'Apples', qty: 6, category: 'produce', done: false, addedAt: '2024-11-01T10:00:00Z' }
]

function stored() {
  return JSON.parse(localStorage.getItem(KEY))
}

function add(name, qty, category) {
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: name } })
  if (qty !== undefined) {
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: qty } })
  }
  if (category !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('category'), { target: { value: category } })
  }
  fireEvent.click(screen.getByText('Add'))
}

// jsdom blocks a click on Add when the number input is invalid (min=1, step=1);
// submitting the form event directly reaches handleAdd with the raw value.
function submitRaw(name, qty) {
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: name } })
  fireEvent.change(screen.getByDisplayValue('1'), { target: { value: qty } })
  fireEvent.submit(screen.getByText('Add').closest('form'))
}

function added() {
  return stored().find((i) => i.id !== 'a1')
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify(EXISTING))
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-01-02T03:04:05.000Z'))
  render(<App />)
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('App handleAdd', () => {
  test('builds the item with an i-prefixed random UUID id, an open state and the current time', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('1234-uuid')
    add('bananas', '3', 'snacks')
    expect(added()).toEqual({
      id: 'i1234-uuid',
      name: 'bananas',
      qty: 3,
      category: 'snacks',
      done: false,
      addedAt: '2025-01-02T03:04:05.000Z'
    })
  })

  test('appends the new item after the existing ones', () => {
    add('bananas')
    expect(stored().map((i) => i.name)).toEqual(['Apples', 'bananas'])
  })

  test('keeps the name as typed, without trimming or capitalising', () => {
    add('  bananas ')
    expect(added().name).toBe('  bananas ')
  })

  test('an empty category becomes other', () => {
    add('bananas', '2', '')
    expect(added().category).toBe('other')
  })

  test('the quantity is parsed as an integer, dropping any fraction', () => {
    submitRaw('bananas', '2.7')
    expect(added().qty).toBe(2)
  })

  test('a quantity of zero falls back to 1', () => {
    submitRaw('bananas', '0')
    expect(added().qty).toBe(1)
  })

  test('a negative quantity is kept as it is', () => {
    submitRaw('bananas', '-3')
    expect(added().qty).toBe(-3)
  })

  test('an emptied quantity falls back to 1', () => {
    add('bananas', '')
    expect(added().qty).toBe(1)
  })

  test('each add gets its own id', () => {
    add('bananas')
    add('pears')
    const ids = stored().map((i) => i.id)
    expect(new Set(ids).size).toBe(3)
    expect(ids.slice(1).every((id) => id.startsWith('i'))).toBe(true)
  })

  test('highlights the new row on the next tick and clears it 800ms later', () => {
    add('bananas')
    const row = screen.getByText('Bananas').closest('li')
    expect(row).not.toHaveClass('highlight')
    act(() => { vi.advanceTimersByTime(0) })
    expect(row).toHaveClass('highlight')
    act(() => { vi.advanceTimersByTime(799) })
    expect(row).toHaveClass('highlight')
    act(() => { vi.advanceTimersByTime(1) })
    expect(row).not.toHaveClass('highlight')
  })

  test('a later add moves the highlight to the newer row', () => {
    add('bananas')
    act(() => { vi.advanceTimersByTime(0) })
    add('pears')
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByText('Pears').closest('li')).toHaveClass('highlight')
    expect(screen.getByText('Bananas').closest('li')).not.toHaveClass('highlight')
  })

  test('unmounting before the timers fire cancels the pending highlight without error', () => {
    add('bananas')
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    cleanup()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(errorSpy).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
