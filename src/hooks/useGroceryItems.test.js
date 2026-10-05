import { renderHook, act, waitFor } from '@testing-library/react'
import { useGroceryItems } from './useGroceryItems'
import { STORAGE_KEY } from '../config'

const stored = [{ id: '1', name: 'Milk', qty: 2, category: 'dairy', done: false }]
const seed = [{ id: 's1', name: 'Seed apples', qty: 6, category: 'produce', done: false }]

function okResponse(data) {
  return { ok: true, json: () => Promise.resolve(data) }
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(okResponse(seed))))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test('loads the items from localStorage without fetching the seed', async () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  const { result } = renderHook(() => useGroceryItems())
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.items).toEqual(stored)
  expect(result.current.error).toBe(null)
  expect(fetch).not.toHaveBeenCalled()
})

test('falls back to fetching the seed when storage is empty', async () => {
  const { result } = renderHook(() => useGroceryItems())
  expect(result.current.loading).toBe(true)
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(fetch).toHaveBeenCalledWith('/seed.json')
  expect(result.current.items).toEqual(seed)
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(seed)
})

test('reports an error when the seed fetch fails', async () => {
  fetch.mockImplementation(() => Promise.resolve({ ok: false, statusText: 'Not Found' }))
  const { result } = renderHook(() => useGroceryItems())
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.error).toBe('Not Found')
  expect(result.current.items).toEqual([])
})

test('does not dispatch or persist after unmount while the fetch is pending', async () => {
  let resolve
  fetch.mockImplementation(() => new Promise((r) => { resolve = r }))
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const { result, unmount } = renderHook(() => useGroceryItems())
  unmount()
  await act(async () => {
    resolve(okResponse(seed))
    await Promise.resolve()
  })
  expect(result.current.items).toEqual([])
  expect(result.current.loading).toBe(true)
  expect(localStorage.getItem(STORAGE_KEY)).toBe(null)
  expect(errorSpy).not.toHaveBeenCalled()
})

test('lastSaved is null before any write and changes only after a write', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  const { result } = renderHook(() => useGroceryItems())
  const first = result.current.lastSaved
  expect(first).toBe('2024-01-01T10:00:00.000Z')

  // time passes and the hook re-renders for a non-item reason: no new save time
  vi.setSystemTime(new Date('2024-01-01T10:05:00.000Z'))
  act(() => {})
  expect(result.current.lastSaved).toBe(first)

  act(() => result.current.dispatch({ type: 'toggle', id: '1' }))
  expect(result.current.lastSaved).toBe('2024-01-01T10:05:00.000Z')
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].done).toBe(true)
})

test('lastSaved stays null while the seed is still loading', () => {
  fetch.mockImplementation(() => new Promise(() => {}))
  const { result } = renderHook(() => useGroceryItems())
  expect(result.current.lastSaved).toBe(null)
})
