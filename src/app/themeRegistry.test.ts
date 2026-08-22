import { describe, expect, it } from 'vitest'
import { getThemeByPath, themeRegistry } from './themeRegistry.ts'

describe('themeRegistry', () => {
  it('menyediakan tiga id dan path unik yang dapat di-resolve kembali', () => {
    const ids = themeRegistry.map(({ id }) => id)
    const paths = themeRegistry.map(({ path }) => path)

    expect(new Set(ids).size).toBe(3)
    expect(new Set(paths).size).toBe(3)

    for (const theme of themeRegistry) {
      expect(theme.path).toMatch(/^\/[a-z-]+$/)
      expect(getThemeByPath(theme.path)).toEqual(theme)
      expect(getThemeByPath(`${theme.path}/`)).toEqual(theme)
    }
  })
})
