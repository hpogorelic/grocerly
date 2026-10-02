import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

vi.mock('react-dom', () => ({ default: { render: vi.fn() } }))

test('main.jsx renders <App /> into #root', async () => {
  document.body.innerHTML = '<div id="root"></div>'
  await import('./main')
  expect(ReactDOM.render).toHaveBeenCalledTimes(1)
  const [element, container] = ReactDOM.render.mock.calls[0]
  expect(element.type).toBe(App)
  expect(container).toBe(document.getElementById('root'))
})
