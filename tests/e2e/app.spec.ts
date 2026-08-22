import { expect, test, type Page } from '@playwright/test'

const routes = [
  {
    path: '/',
    heading: 'Pilih cara kecil untuk mengatakan sesuatu yang besar.',
  },
  {
    path: '/heart-repair',
    heading: 'Ada satu hati yang perlu sedikit dirawat.',
    linkName: 'Tiny Heart Repair Shop',
  },
  {
    path: '/lost-and-found',
    heading: 'Ada beberapa hal milikmu yang masih tersimpan di sini.',
    linkName: 'The Things You Left With Me',
  },
  {
    path: '/midnight-radio',
    heading: 'Ada satu siaran yang hanya muncul saat dunia sudah tenang.',
    linkName: '11:11 Midnight Radio',
  },
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
  const errors = collectPageErrors(page)

  await page.goto('/')

  for (const route of routes.slice(1)) {
    const themeLink = page.getByRole('link', { name: route.linkName })

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

  expect(errors).toEqual([])
})

test('unknown route menampilkan halaman Not Found', async ({ page }) => {
  await page.goto('/route-yang-tidak-ada')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Halaman tidak ditemukan',
  )
})

test('semua route tidak mengalami horizontal overflow pada viewport yang didukung', async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1280, height: 800 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)

    for (const route of [...routes, { path: '/unknown', heading: 'Not Found' }]) {
      await page.goto(route.path)

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      )

      expect(
        hasHorizontalOverflow,
        `${route.path} mengalami overflow pada ${viewport.width}px`,
      ).toBe(false)
    }
  }
})

test('gallery tetap utuh ketika prefers-reduced-motion aktif', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const themeLinks = page.getByRole('navigation').getByRole('link')
  await expect(themeLinks).toHaveCount(3)

  for (const themeLink of await themeLinks.all()) {
    await expect(themeLink).toBeVisible()
  }
})

test('SVG dekoratif tidak masuk ke accessibility tree', async ({ page }) => {
  await page.goto('/')

  const decorativeSvgs = page.locator('nav svg')
  await expect(decorativeSvgs).toHaveCount(3)

  for (const svg of await decorativeSvgs.all()) {
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
    await expect(svg).toHaveAttribute('focusable', 'false')
  }

  await expect(page.getByRole('img')).toHaveCount(0)
})
