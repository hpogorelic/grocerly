import React from 'react'
import { render, screen, within, fireEvent, act, cleanup } from '@testing-library/react'
import axios from 'axios'
import App from './App'
import { emit } from './utils/bus'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))

const KEY = 'grocerly-items'

const FIXTURE = [
  { id: 'a1', name: 'Apples', qty: 6, category: 'produce', done: false, addedAt: '2024-11-01T10:00:00Z' },
  { id: 'a2', name: 'Milk', qty: 2, category: 'dairy', done: false, addedAt: '2024-11-02T10:00:00Z' },
  { id: 'a3', name: 'Eggs', qty: 12, category: 'dairy', done: true, addedAt: '2024-11-03T10:00:00Z' },
  { id: 'a4', name: 'Bread', qty: 1, category: 'bakery', done: false, addedAt: '2024-11-04T10:00:00Z' }
]

function seedStorage(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

function renderApp() {
  render(<App />)
}

async function flush() {
  await act(async () => {})
}

function click(name) {
  fireEvent.click(screen.getByRole('button', { name }))
}

function names() {
  return screen.queryAllByRole('listitem').map((li) => li.querySelectorAll('span')[0].textContent)
}

function rowFor(text) {
  return screen.getByText(text).closest('li')
}

function addItem(name, qty, category) {
  fireEvent.change(screen.getByPlaceholderText('item'), { target: { value: name } })
  if (qty !== undefined) {
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: qty } })
  }
  if (category !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('category'), { target: { value: category } })
  }
  fireEvent.click(screen.getByText('Add'))
}

function stored() {
  return JSON.parse(localStorage.getItem(KEY))
}

beforeEach(() => {
  localStorage.clear()
  axios.get.mockReset()
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
})

test('renders the heading', async () => {
  seedStorage([
    { id: 'x', name: 'Tea', qty: 1, category: 'pantry', done: false, addedAt: '2024-11-01T10:00:00Z' }
  ])
  renderApp()
  expect(screen.getByText('Grocerly')).toBeInTheDocument()
  expect(screen.getByText('Tea')).toBeInTheDocument()
})

describe('loading and persistence', () => {
  test('renders items stored in localStorage without calling axios', () => {
    seedStorage(FIXTURE)
    renderApp()
    expect(axios.get).not.toHaveBeenCalled()
    expect(names()).toEqual(['Bread', 'Eggs', 'Milk', 'Apples'])
    expect(screen.getByText('4 items, 3 open, 1 done (25%)')).toBeInTheDocument()
  })

  test('writes the items back to localStorage and shows a Saved line after loading', () => {
    seedStorage(FIXTURE)
    renderApp()
    expect(stored()).toEqual(FIXTURE)
    expect(screen.getByText(/^Saved .* ago \(\d\d\.\d\d\.\d{4} \d\d:\d\d\)$/)).toBeInTheDocument()
  })

  test('the Saved line is refreshed by the one-second tick', () => {
    seedStorage(FIXTURE)
    renderApp()
    expect(screen.getByText(/^Saved a few seconds ago/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(60 * 1000) })
    expect(screen.getByText(/^Saved a minute ago/)).toBeInTheDocument()
  })

  test('shows Loading… then the seed items when storage is empty and axios succeeds', async () => {
    axios.get.mockResolvedValue({ data: FIXTURE })
    renderApp()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(axios.get).toHaveBeenCalledWith('/seed.json')
    await flush()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
    expect(names()).toEqual(['Bread', 'Eggs', 'Milk', 'Apples'])
    expect(stored()).toEqual(FIXTURE)
  })

  test('shows the error message when storage is empty and axios fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'))
    renderApp()
    await flush()
    expect(screen.getByText('Error: Network Error')).toBeInTheDocument()
    expect(screen.queryByText('Grocerly')).not.toBeInTheDocument()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  test('falls back to the seed when storage holds an empty list', async () => {
    seedStorage([])
    axios.get.mockResolvedValue({ data: FIXTURE })
    renderApp()
    await flush()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(names()).toHaveLength(4)
  })

  test('falls back to the seed when storage holds invalid JSON', async () => {
    localStorage.setItem(KEY, '{not json')
    axios.get.mockResolvedValue({ data: FIXTURE })
    renderApp()
    await flush()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(names()).toHaveLength(4)
  })

  test('a reload round-trips added items through localStorage', () => {
    seedStorage(FIXTURE)
    renderApp()
    addItem('bananas')
    cleanup()
    renderApp()
    expect(axios.get).not.toHaveBeenCalled()
    expect(screen.getByText('Bananas')).toBeInTheDocument()
    expect(names()).toHaveLength(5)
  })
})

describe('add, toggle, remove, clear done', () => {
  beforeEach(() => {
    seedStorage(FIXTURE)
    renderApp()
  })

  test('adds an item with quantity and category and clears the form', () => {
    addItem('bananas', '3', 'snacks')
    const row = rowFor('Bananas')
    expect(within(row).getByText('3x')).toBeInTheDocument()
    expect(within(row).getByText('snacks')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'snacks' })).toBeInTheDocument()
    expect(screen.getByText('5 items, 4 open, 1 done (20%)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('item')).toHaveValue('')
    expect(screen.getByPlaceholderText('category')).toHaveValue('')
    expect(stored().map((i) => i.name)).toContain('bananas')
  })

  test('a new item defaults to quantity 1 and category other, and is open', () => {
    addItem('bananas')
    const row = rowFor('Bananas')
    expect(within(row).getByText('1x')).toBeInTheDocument()
    expect(within(row).getByText('other')).toBeInTheDocument()
    expect(within(row).getByRole('checkbox')).not.toBeChecked()
  })

  test('submitting an empty name adds nothing', () => {
    fireEvent.click(screen.getByText('Add'))
    expect(names()).toHaveLength(4)
    expect(stored()).toHaveLength(4)
  })

  test('the new item is highlighted briefly after being added', () => {
    addItem('bananas')
    const row = rowFor('Bananas')
    expect(row).not.toHaveClass('highlight')
    act(() => { vi.advanceTimersByTime(0) })
    expect(row).toHaveClass('highlight')
    act(() => { vi.advanceTimersByTime(800) })
    expect(row).not.toHaveClass('highlight')
  })

  test('adding the same name twice shows a Duplicates line', () => {
    expect(screen.queryByText(/Duplicates:/)).not.toBeInTheDocument()
    addItem('milk')
    expect(screen.getByText('Duplicates: Milk, milk')).toBeInTheDocument()
  })

  test('an item:add bus event adds an item', () => {
    act(() => { emit('item:add', { name: 'rice', qty: '2', category: 'pantry' }) })
    const row = rowFor('Rice')
    expect(within(row).getByText('2x')).toBeInTheDocument()
    expect(within(row).getByText('pantry')).toBeInTheDocument()
  })

  test('toggling an item marks it done and updates the counts and storage', () => {
    const row = rowFor('Milk')
    fireEvent.click(within(row).getByRole('checkbox'))
    expect(rowFor('Milk')).toHaveClass('done')
    expect(within(rowFor('Milk')).getByRole('checkbox')).toBeChecked()
    expect(screen.getByText('4 items, 2 open, 2 done (50%)')).toBeInTheDocument()
    expect(stored().find((i) => i.id === 'a2').done).toBe(true)
  })

  test('toggling a done item reopens it', () => {
    fireEvent.click(within(rowFor('Eggs')).getByRole('checkbox'))
    expect(rowFor('Eggs')).not.toHaveClass('done')
    expect(screen.getByText('4 items, 4 open, 0 done (0%)')).toBeInTheDocument()
  })

  test('removing an item deletes it from the list and storage', () => {
    fireEvent.click(within(rowFor('Milk')).getByRole('button', { name: 'x' }))
    expect(screen.queryByText('Milk')).not.toBeInTheDocument()
    expect(screen.getByText('3 items, 2 open, 1 done (33%)')).toBeInTheDocument()
    expect(stored().map((i) => i.id)).toEqual(['a1', 'a3', 'a4'])
  })

  test('Clear done removes only the done items', () => {
    click('Clear done')
    expect(names()).toEqual(['Bread', 'Milk', 'Apples'])
    expect(screen.getByText('3 items, 3 open, 0 done (0%)')).toBeInTheDocument()
    expect(stored()).toHaveLength(3)
  })

  test('removing every item shows the empty message', () => {
    names().forEach((n) => {
      fireEvent.click(within(rowFor(n)).getByRole('button', { name: 'x' }))
    })
    expect(screen.getByText('Nothing to buy.')).toBeInTheDocument()
    expect(screen.getByText('0 items, 0 open, 0 done (0%)')).toBeInTheDocument()
  })
})

describe('filters and search', () => {
  beforeEach(() => {
    seedStorage(FIXTURE)
    renderApp()
  })

  test('All shows every item', () => {
    click('Done')
    click('All')
    expect(names()).toHaveLength(4)
  })

  test('Open shows only items that are not done', () => {
    click('Open')
    expect(names()).toEqual(['Bread', 'Milk', 'Apples'])
  })

  test('Done shows only done items', () => {
    click('Done')
    expect(names()).toEqual(['Eggs'])
  })

  test('Big shows only items with quantity 5 or more', () => {
    click('Big')
    expect(names()).toEqual(['Eggs', 'Apples'])
  })

  test('a category button shows only that category', () => {
    click('dairy')
    expect(names()).toEqual(['Eggs', 'Milk'])
    click('bakery')
    expect(names()).toEqual(['Bread'])
  })

  test('search filters by case-insensitive substring of the name', () => {
    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'ILK' } })
    expect(names()).toEqual(['Milk'])
    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: '' } })
    expect(names()).toHaveLength(4)
  })

  test('search combines with the active filter', () => {
    click('dairy')
    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'e' } })
    expect(names()).toEqual(['Eggs'])
  })

  test('shows the empty message when nothing matches', () => {
    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'zzz' } })
    expect(screen.getByText('Nothing to buy.')).toBeInTheDocument()
  })

  test('filters do not change the totals in the stats line', () => {
    click('Done')
    expect(screen.getByText('4 items, 3 open, 1 done (25%)')).toBeInTheDocument()
  })
})

describe('sorting', () => {
  beforeEach(() => {
    seedStorage(FIXTURE)
    renderApp()
  })

  test('the default order is newest first', () => {
    expect(names()).toEqual(['Bread', 'Eggs', 'Milk', 'Apples'])
  })

  test('Sort by name sorts ascending first, then toggles to descending and back', () => {
    click('Sort by name')
    expect(names()).toEqual(['Apples', 'Bread', 'Eggs', 'Milk'])
    click('Sort by name')
    expect(names()).toEqual(['Milk', 'Eggs', 'Bread', 'Apples'])
    click('Sort by name')
    expect(names()).toEqual(['Apples', 'Bread', 'Eggs', 'Milk'])
  })

  test('Sort by date switches to ascending, then toggles to descending', () => {
    click('Sort by date')
    expect(names()).toEqual(['Apples', 'Milk', 'Eggs', 'Bread'])
    click('Sort by date')
    expect(names()).toEqual(['Bread', 'Eggs', 'Milk', 'Apples'])
  })

  test('switching from one sort key to the other restarts at ascending', () => {
    click('Sort by name')
    click('Sort by name')
    click('Sort by date')
    expect(names()).toEqual(['Apples', 'Milk', 'Eggs', 'Bread'])
  })
})

describe('archived list', () => {
  test('Show archived lists the done items a second time and Hide removes them', () => {
    seedStorage(FIXTURE)
    renderApp()
    click('Show archived')
    expect(screen.getAllByText('Eggs')).toHaveLength(2)
    expect(screen.getAllByText('Milk')).toHaveLength(1)
    click('Hide archived')
    expect(screen.getAllByText('Eggs')).toHaveLength(1)
  })

  test('shows a message when nothing is archived', () => {
    seedStorage([FIXTURE[0]])
    renderApp()
    click('Show archived')
    expect(screen.getByText('Nothing archived.')).toBeInTheDocument()
  })
})
