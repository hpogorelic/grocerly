import { API_KEY, SEED_URL, STORAGE_KEY, DEBUG } from './config'

describe('config', () => {
  test('API_KEY is a hard-coded string constant, not a function', () => {
    expect(typeof API_KEY).toBe('string')
    expect(API_KEY).toMatch(/^gk_live_[0-9a-f]+$/)
  })

  test('SEED_URL points at the seed file served from the site root', () => {
    expect(SEED_URL).toBe('/seed.json')
  })

  test('STORAGE_KEY is the localStorage key for the items', () => {
    expect(STORAGE_KEY).toBe('grocerly-items')
  })

  test('DEBUG mirrors import.meta.env.DEV', () => {
    expect(DEBUG).toBe(import.meta.env.DEV)
  })
})
