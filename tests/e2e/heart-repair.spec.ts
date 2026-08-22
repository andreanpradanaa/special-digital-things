import { expect, test, type Page } from '@playwright/test'

const heartFlows = [
  {
    id: 'tired',
    diagnosis: 'Tenagaku hampir habis',
    tool: 'Gentle Recharge Cable',
    reveal: 'Tidak apa-apa berhenti sebentar.',
    certificate: 'Gentle recharge untuk hari yang melelahkan',
  },
  {
    id: 'overthinking',
    diagnosis: 'Pikiranku terlalu ramai',
    tool: 'Anti-Overthinking Mist',
    reveal: 'Tidak semuanya harus diselesaikan malam ini.',
    certificate: 'Quiet mist untuk pikiran yang terlalu ramai',
  },
  {
    id: 'bad-day',
    diagnosis: 'Hari ini tidak berjalan baik',
    tool: 'Emergency Hug Patch',
    reveal: 'Satu hari tidak menentukan semuanya.',
    certificate: 'Emergency hug patch untuk hari yang berat',
  },
  {
    id: 'missing-someone',
    diagnosis: 'Aku sedang sangat merindukan seseorang',
    tool: 'Long-Distance Memory Tape',
    reveal: 'Jarak tidak mengambil semuanya.',
    certificate: 'Long-distance memory tape untuk rasa rindu',
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

function skipLink(page: Page) {
  return page.getByRole('link', { name: 'Lewati ke konten utama' })
}

async function expectSkipLinkHidden(page: Page) {
  const isOutsideViewport = await skipLink(page).evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    return bounds.bottom <= 0
  })

  expect(isOutsideViewport).toBe(true)
}

async function expectSkipLinkVisible(page: Page) {
  const isWithinViewport = await skipLink(page).evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    return bounds.top >= 0 && bounds.bottom <= window.innerHeight
  })

  expect(isWithinViewport).toBe(true)
}

async function startInspection(page: Page) {
  await page.goto('/heart-repair')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada satu hati yang perlu sedikit dirawat.',
  )
  await page.getByRole('button', { name: /Mulai pemeriksaan/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Bagian mana yang terasa paling berat hari ini?',
  )
}

async function openRepairBay(
  page: Page,
  flow: (typeof heartFlows)[number],
) {
  await page.getByRole('button', { name: flow.diagnosis }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Bengkel menemukan alat yang mungkin membantu.',
  )
  await expect(page.getByText(flow.tool, { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Bawa ke meja repair/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Tempelkan alat pada bagian hati yang perlu dirawat.',
  )
}

async function completeWithKeyboardAlternative(
  page: Page,
  flow: (typeof heartFlows)[number],
) {
  await page.getByRole('button', { name: `Gunakan ${flow.tool}` }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(flow.reveal)
  await page.getByRole('button', { name: /Lihat care certificate/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Servis kecil selesai.',
  )
  await expect(page.getByText(flow.certificate, { exact: true })).toBeVisible()
}

test('direct navigation menampilkan work order tanpa console error', async ({
  page,
}) => {
  const errors = collectPageErrors(page)

  await page.goto('/heart-repair')

  await expect(page.getByText('HEART CARE WORK ORDER')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada satu hati yang perlu sedikit dirawat.',
  )
  await expect(page.getByText('From Ari, for Nara')).toBeVisible()
  expect(errors).toEqual([])
})

test('skip link hanya terlihat saat mendapat focus keyboard dan memindahkan focus ke main', async ({
  page,
}) => {
  await page.goto('/heart-repair')
  await expectSkipLinkHidden(page)

  await page.keyboard.press('Tab')
  await expect(skipLink(page)).toBeFocused()
  await expectSkipLinkVisible(page)

  const focusOutline = await skipLink(page).evaluate((element) => {
    const style = window.getComputedStyle(element)
    return { style: style.outlineStyle, width: style.outlineWidth }
  })

  expect(focusOutline.style).not.toBe('none')
  expect(focusOutline.width).not.toBe('0px')

  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await expectSkipLinkHidden(page)
})

test('pointer flow dan keyboard flow tidak membuat skip link menetap', async ({
  page,
}) => {
  await page.goto('/heart-repair')
  await page.getByRole('button', { name: /Mulai pemeriksaan/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)

  const keyboardPage = await page.context().newPage()
  await keyboardPage.goto('/heart-repair')
  await keyboardPage.keyboard.press('Tab')
  await expect(skipLink(keyboardPage)).toBeFocused()

  const startButton = keyboardPage.getByRole('button', {
    name: /Mulai pemeriksaan/,
  })
  for (let tabCount = 0; tabCount < 6; tabCount += 1) {
    if (
      await startButton.evaluate(
        (element) => document.activeElement === element,
      )
    ) {
      break
    }
    await keyboardPage.keyboard.press('Tab')
  }

  await expect(startButton).toBeFocused()
  await keyboardPage.keyboard.press('Enter')
  await expect(keyboardPage.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(keyboardPage)
})

test('heading scene memegang focus dan skip link tersembunyi pada setiap phase', async ({
  page,
}) => {
  await page.goto('/heart-repair')
  await page.getByRole('button', { name: /Mulai pemeriksaan/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)

  await page.getByRole('button', { name: heartFlows[2].diagnosis }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)

  await page.getByRole('button', { name: /Bawa ke meja repair/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)

  await page
    .getByRole('button', { name: `Gunakan ${heartFlows[2].tool}` })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    heartFlows[2].reveal,
  )
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)

  await page.getByRole('button', { name: /Lihat care certificate/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Servis kecil selesai.',
  )
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expectSkipLinkHidden(page)
})

test('skip link tidak regress pada gallery, Not Found, dan placeholder route', async ({
  page,
}) => {
  for (const route of ['/', '/lost-and-found', '/midnight-radio', '/not-found']) {
    await page.goto(route)
    await expectSkipLinkHidden(page)
    await page.keyboard.press('Tab')
    await expect(skipLink(page)).toBeFocused()
    await expectSkipLinkVisible(page)
  }
})

for (const flow of heartFlows) {
  test(`${flow.id} menyelesaikan flow hingga care certificate`, async ({ page }) => {
    await startInspection(page)
    await openRepairBay(page, flow)
    await completeWithKeyboardAlternative(page, flow)
  })
}

test('drag alat ke target menyelesaikan perbaikan', async ({ page }) => {
  await startInspection(page)
  await openRepairBay(page, heartFlows[2])

  const tool = page.getByTestId('repair-tool')
  const target = page.getByTestId('repair-target')
  const toolBox = await tool.boundingBox()
  const targetBox = await target.boundingBox()

  expect(toolBox).not.toBeNull()
  expect(targetBox).not.toBeNull()

  if (!toolBox || !targetBox) {
    throw new Error('Tool atau target perbaikan tidak dapat ditemukan.')
  }

  await page.mouse.move(toolBox.x + toolBox.width / 2, toolBox.y + toolBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 10,
  })
  await page.mouse.up()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    heartFlows[2].reveal,
  )
})

test('replay mengembalikan work order dan link koleksi serta browser Back bekerja', async ({
  page,
}) => {
  await startInspection(page)
  await openRepairBay(page, heartFlows[0])
  await completeWithKeyboardAlternative(page, heartFlows[0])

  await page.getByRole('button', { name: 'Ulangi pengalaman' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada satu hati yang perlu sedikit dirawat.',
  )

  await page.getByRole('link', { name: 'Kembali ke koleksi' }).first().click()
  await expect(page).toHaveURL('/')
  await page.goBack()
  await expect(page).toHaveURL('/heart-repair')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada satu hati yang perlu sedikit dirawat.',
  )
})

test('focus indicator dan SVG dekoratif tetap accessible', async ({ page }) => {
  await startInspection(page)
  const diagnosisButton = page.getByRole('button', {
    name: 'Tenagaku hampir habis',
  })

  await page.keyboard.press('Tab')
  await expect(diagnosisButton).toBeFocused()

  const focusOutline = await diagnosisButton.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return { style: style.outlineStyle, width: style.outlineWidth }
  })

  expect(focusOutline.style).not.toBe('none')
  expect(focusOutline.width).not.toBe('0px')

  const decorativeSvgs = page.locator('svg')
  for (const svg of await decorativeSvgs.all()) {
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
    await expect(svg).toHaveAttribute('focusable', 'false')
  }
  await expect(page.getByRole('img')).toHaveCount(0)
})

test('reduced motion tidak menyembunyikan flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await startInspection(page)
  await openRepairBay(page, heartFlows[2])
  await completeWithKeyboardAlternative(page, heartFlows[2])
})

test('tidak ada horizontal overflow pada viewport yang didukung', async ({ page }) => {
  const viewports = [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1280, height: 800 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/heart-repair')
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )

    expect(hasOverflow, `Overflow pada ${viewport.width}px`).toBe(false)
  }
})

test('Lost and Found dan Midnight Radio tersedia', async ({ page }) => {
  await page.goto('/lost-and-found')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada beberapa hal milikmu yang masih tersimpan di sini.',
  )

  await page.goto('/midnight-radio')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ada satu siaran yang hanya muncul saat dunia sudah tenang.',
  )
})
