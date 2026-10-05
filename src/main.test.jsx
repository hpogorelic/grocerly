import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const render = vi.fn()
vi.mock('react-dom/client', () => ({ createRoot: vi.fn(() => ({ render })) }))

test('main.jsx creates a root on #root and renders <App /> inside StrictMode', async () => {
  document.body.innerHTML = '<div id="root"></div>'
  await import('./main')
  expect(createRoot).toHaveBeenCalledTimes(1)
  expect(createRoot.mock.calls[0][0]).toBe(document.getElementById('root'))
  expect(render).toHaveBeenCalledTimes(1)
  const [element] = render.mock.calls[0]
  expect(element.type).toBe(StrictMode)
  expect(element.props.children.type).toBe(App)
})
