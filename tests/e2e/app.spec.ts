import { expect, test, type Page } from '@playwright/test'

const routes = [
  { path: '/', heading: 'Koleksi Interactive Digital Gifts' },
  { path: '/heart-repair', heading: 'Tiny Heart Repair Shop' },
  { path: '/lost-and-found', heading: 'The Things You Left With Me' },
  { path: '/midnight-radio', heading: '11:11 Midnight Radio' },
] as const

function collectPageErrors(page: Page) {
  const errors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(error.message))

  return errors
}

for (const route of routes) {
  test(`direct route ${route.path} menampilkan heading yang benar`, async ({
    page,
  }) => {
    const errors = collectPageErrors(page)

    await page.goto(route.path)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.heading,
    )
    expect(errors).toEqual([])
  })
}

test('link halaman utama membuka ketiga route dan browser Back berfungsi', async ({
  page,
}) => {
  await page.goto('/')

  for (const route of routes.slice(1)) {
    const themeLink = page.getByRole('link', { name: route.heading })

    await themeLink.focus()
    await expect(themeLink).toBeFocused()

    const focusOutline = await themeLink.evaluate((element) => {
      const style = window.getComputedStyle(element)

      return {
        style: style.outlineStyle,
        width: style.outlineWidth,
      }
    })

    expect(focusOutline.style).not.toBe('none')
    expect(focusOutline.width).not.toBe('0px')

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(route.path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      route.heading,
    )

    await page.goBack()
    await expect(page).toHaveURL('/')
  }
})

test('unknown route menampilkan halaman Not Found', async ({ page }) => {
  await page.goto('/route-yang-tidak-ada')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Halaman tidak ditemukan',
  )
})

test('semua route tidak mengalami horizontal overflow pada viewport 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })

  for (const route of [...routes, { path: '/unknown', heading: 'Not Found' }]) {
    await page.goto(route.path)

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )

    expect(hasHorizontalOverflow, `${route.path} mengalami overflow`).toBe(false)
  }
})
