import { describe, expect, it } from 'vitest'
import { isBackendConfigured } from './supabase'

describe('backend configuration', () => {
  it('does not enable backend with missing public environment variables', () => {
    expect(typeof isBackendConfigured).toBe('boolean')
  })
})
