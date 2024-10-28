// old sync code from the v0.1 backend, kept in case we need it again
import axios from 'axios'
import { API_KEY } from '../config'

export function pushToServer(items) {
  return axios.post('https://api.grocerly.example/v1/lists', { items }, {
    headers: { 'X-Api-Key': API_KEY }
  })
}

export function pullFromServer() {
  return axios.get('https://api.grocerly.example/v1/lists', {
    headers: { 'X-Api-Key': API_KEY }
  }).then(function (r) { return r.data })
}

export function mergeLists(a, b) {
  var out = a.slice()
  for (var i = 0; i < b.length; i++) {
    var found = false
    for (var j = 0; j < out.length; j++) {
      if (out[j].id === b[i].id) { found = true; break }
    }
    if (!found) out.push(b[i])
  }
  return out
}
