import { expect, test, type Page } from '@playwright/test'

const signals = [
  { frequency: 883, heading: 'Suara yang selalu ingin kusimpan.' },
  { frequency: 967, heading: 'Beberapa orang terdengar seperti arah pulang.' },
  { frequency: 1049, heading: 'Ada menit-menit yang ingin kuperlambat.' },
] as const

function collectPageErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

async function powerRadio(page: Page) {
  await page.goto('/midnight-radio')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu siaran yang hanya muncul saat dunia sudah tenang.')
  await page.getByRole('button', { name: /Nyalakan radio/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cari tiga suara kecil di antara static.')
}

async function captureSignal(page: Page, signal: (typeof signals)[number]) {
  const dial = page.getByLabel('Putar tuning dial')
  await dial.fill(String(signal.frequency))
  await expect(page.locator('[data-locked="true"]')).toHaveText('SIGNAL LOCKED')
  await expect(page.getByRole('button', { name: /Tangkap siaran/i })).toBeEnabled()
  await page.getByRole('button', { name: /Tangkap siaran/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(signal.heading)
}

async function receiveAllSignals(page: Page) {
  await powerRadio(page)
  for (const signal of signals) {
    await captureSignal(page, signal)
    await page.getByRole('button', { name: /Kembali ke frekuensi/i }).click()
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sekarang hanya tersisa satu suara.')
}

test('direct route, skip link, dan radio off tersedia tanpa console error', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto('/midnight-radio')
  const skip = page.getByRole('link', { name: 'Lewati ke konten utama' })
  expect(await skip.evaluate((element) => element.getBoundingClientRect().bottom <= 0)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await expect(page.getByText('SPEAKER / SILENT')).toBeVisible()
  expect(errors).toEqual([])
})

test('range dapat dioperasikan dengan keyboard dan signal lock jelas', async ({ page }) => {
  await powerRadio(page)
  const dial = page.getByLabel('Putar tuning dial')
  await dial.focus()
  await page.keyboard.press('ArrowRight')
  await expect(dial).toHaveValue('881')
  await dial.fill('883')
  await expect(dial).toHaveAttribute('aria-valuetext', /88.3 FM.*SIGNAL LOCKED/)
  await expect(page.getByText('Siaran sudah jelas. Tangkap sebelum ia menghilang.')).toBeVisible()
})

test('tiga broadcast diterima unik sebelum PRIVATE 11:11 terbuka', async ({ page }) => {
  const errors = collectPageErrors(page)
  await powerRadio(page)
  await expect(page.getByRole('button', { name: /Buka siaran 11:11/i })).toHaveCount(0)
  for (const signal of signals) {
    await captureSignal(page, signal)
    await page.getByRole('button', { name: /Kembali ke frekuensi/i }).click()
  }
  await expect(page.getByText('11:11 PM', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sekarang hanya tersisa satu suara.')
  expect(errors).toEqual([])
})

test('body private unlock tetap kontras, stabil, dan tidak tertutup overlay', async ({ page }) => {
  await receiveAllSignals(page)
  const privateBody = page.getByText(
    'Frekuensi ini tidak tercatat di radio mana pun. Tetapi malam ini, ia tahu harus menuju siapa.',
    { exact: true },
  )
  await expect(privateBody).toBeVisible()
  await page.waitForTimeout(350)

  const audit = await privateBody.evaluate((element) => {
    const relativeLuminance = (value: string) => {
      const channels = value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number)
      if (!channels || channels.length !== 3) throw new Error(`Warna tidak dapat dibaca: ${value}`)
      const linear = channels.map((channel) => {
        const normalized = channel / 255
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4
      })
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    }
    const style = window.getComputedStyle(element)
    const panel = element.closest('article')
    const panelStyle = panel ? window.getComputedStyle(panel) : null
    const bounds = element.getBoundingClientRect()
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
    const foreground = style.color
    const background = panelStyle?.backgroundColor ?? ''
    const foregroundLuminance = relativeLuminance(foreground)
    const backgroundLuminance = relativeLuminance(background)

    return {
      foreground,
      background,
      opacity: style.opacity,
      visibility: style.visibility,
      panelOpacity: panelStyle?.opacity,
      notCovered: hit === element || element.contains(hit),
      ratio:
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
    }
  })

  expect(audit).toMatchObject({
    foreground: 'rgb(52, 49, 73)',
    background: 'rgb(245, 232, 202)',
    opacity: '1',
    visibility: 'visible',
    panelOpacity: '1',
    notCovered: true,
  })
  expect(audit.ratio).toBeGreaterThanOrEqual(4.5)
})

test('final broadcast, QSL, replay, koleksi, dan browser Back bekerja', async ({ page }) => {
  await receiveAllSignals(page)
  await page.getByRole('button', { name: /Buka siaran 11:11/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Untuk satu orang yang membuat malam terasa lebih dekat.')
  await expect(page.getByText(/Di antara semua suara di dunia/)).toBeVisible()
  await page.getByRole('button', { name: /Konfirmasi pesan diterima/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pesan diterima.')
  await expect(page.getByText('23:11', { exact: true })).toBeVisible()
  await expect(page.getByText('Gusti', { exact: true })).toBeVisible()
  await expect(page.getByText('Andre', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Putar ulang siaran/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu siaran yang hanya muncul saat dunia sudah tenang.')
  await page.getByRole('link', { name: 'Kembali ke koleksi' }).first().click()
  await expect(page).toHaveURL('/')
  await page.goBack()
  await expect(page).toHaveURL('/midnight-radio')
})

test('reduced motion, audio default off, decorative SVG, dan tema lain tidak regress', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await powerRadio(page)
  const sound = page.getByRole('button', { name: /Aktifkan suara/i })
  await expect(sound).toHaveAttribute('aria-pressed', 'false')
  for (const signal of signals) {
    await captureSignal(page, signal)
    await page.getByRole('button', { name: /Kembali ke frekuensi/i }).click()
  }
  await page.getByRole('button', { name: /Buka siaran 11:11/i }).click()
  await expect(page.getByText(/caraku duduk di sebelahmu/)).toBeVisible()
  for (const svg of await page.locator('svg').all()) {
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
    await expect(svg).toHaveAttribute('focusable', 'false')
  }
  await expect(page.getByRole('img')).toHaveCount(0)
  await page.goto('/heart-repair')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu hati yang perlu sedikit dirawat.')
  await page.goto('/lost-and-found')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa hal milikmu yang masih tersimpan di sini.')
})

test('radio tidak mengalami horizontal overflow pada viewport yang didukung', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/midnight-radio')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), `overflow pada ${viewport.width}px`).toBe(false)
  }
})
