import { describe, expect, it } from 'vitest'
import { getThemeByPath, themeRegistry } from './themeRegistry.ts'

describe('themeRegistry', () => {
  it('menyediakan empat id/path unik dan tepat satu featured theme', () => {
    const ids = themeRegistry.map(({ id }) => id)
    const paths = themeRegistry.map(({ path }) => path)

    expect(new Set(ids).size).toBe(4)
    expect(new Set(paths).size).toBe(4)
    expect(themeRegistry.filter(({ placement }) => placement === 'featured')).toHaveLength(1)
    expect(themeRegistry[0].id).toBe('unsaid-garden')

    for (const theme of themeRegistry) {
      expect(theme.path).toMatch(/^\/[a-z-]+$/)
      expect(theme.previewAction.length).toBeGreaterThan(0)
      expect(getThemeByPath(theme.path)).toEqual(theme)
      expect(getThemeByPath(`${theme.path}/`)).toEqual(theme)
    }
  })
})
