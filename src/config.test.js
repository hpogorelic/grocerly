import * as config from './config'
import configSource from './config.js?raw'

const { SEED_URL, STORAGE_KEY, DEBUG } = config

describe('config', () => {
  test('no API key is exported or hardcoded in the config source', () => {
    expect(config).not.toHaveProperty('API_KEY')
    expect(configSource).not.toMatch(/gk_[l]ive|API_KEY/)
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
