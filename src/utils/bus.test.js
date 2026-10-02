import { on, off, emit } from './bus'

test('emit calls every listener of the event with the payload', () => {
  const a = vi.fn()
  const b = vi.fn()
  on('t:multi', a)
  on('t:multi', b)
  emit('t:multi', { x: 1 })
  expect(a).toHaveBeenCalledWith({ x: 1 })
  expect(b).toHaveBeenCalledWith({ x: 1 })
  off('t:multi', a)
  off('t:multi', b)
})

test('emit does not call listeners of other events', () => {
  const a = vi.fn()
  on('t:one', a)
  emit('t:two', 1)
  expect(a).not.toHaveBeenCalled()
  off('t:one', a)
})

test('off removes only the given listener', () => {
  const a = vi.fn()
  const b = vi.fn()
  on('t:off', a)
  on('t:off', b)
  off('t:off', a)
  emit('t:off', 1)
  expect(a).not.toHaveBeenCalled()
  expect(b).toHaveBeenCalledTimes(1)
  off('t:off', b)
})

test('emit and off on an event without listeners do nothing', () => {
  expect(() => emit('t:none', 1)).not.toThrow()
  expect(() => off('t:never', () => {})).not.toThrow()
})

test('registering the same function twice calls it twice', () => {
  const a = vi.fn()
  on('t:dup', a)
  on('t:dup', a)
  emit('t:dup')
  expect(a).toHaveBeenCalledTimes(2)
  off('t:dup', a)
  emit('t:dup')
  expect(a).toHaveBeenCalledTimes(2)
})
