// simple pub/sub so components can talk to each other without props
var listeners = {}

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = []
  listeners[event].push(fn)
}

export function off(event, fn) {
  if (!listeners[event]) return
  listeners[event] = listeners[event].filter(function (l) { return l !== fn })
}

export function emit(event, payload) {
  var list = listeners[event] || []
  for (var i = 0; i < list.length; i++) {
    list[i](payload)
  }
}
