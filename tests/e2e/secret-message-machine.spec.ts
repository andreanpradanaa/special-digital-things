import { expect, test, type Page } from '@playwright/test'

async function openMachine(page: Page) {
  await page.goto('/secret-message-machine')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Secret Message')
}

async function turnWithButton(page: Page) {
  await page.getByRole('button', { name: 'Putar knob', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' })).toBeEnabled()
}

async function openAndClose(page: Page) {
  await page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' }).click()
  const dialog = page.getByRole('dialog', { name: 'You got a secret message.' })
  await expect(dialog).toBeVisible()
  const message = await dialog.locator('p').nth(1).innerText()
  await page.getByRole('button', { name: 'Simpan pesan ini' }).click()
  await expect(dialog).toBeHidden()
  return message
}

test('route langsung, skip link, dan featured gallery menggunakan urutan semantic yang benar', async ({ page }) => {
  await openMachine(page)
  const skip = page.getByRole('link', { name: 'Lewati ke konten utama' })
  expect(await skip.evaluate((element) => element.getBoundingClientRect().bottom <= 0)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()

  await page.goto('/')
  const links = page.getByRole('navigation').getByRole('link')
  await expect(links).toHaveCount(5)
  await expect(links.first()).toHaveAccessibleName(/Secret Message Machine/)
  await links.first().focus()
  await expect(links.first()).toBeFocused()
})

test('keyboard turn, duplicate click guard, capsule output, Escape, dan focus restoration bekerja', async ({ page }) => {
  await openMachine(page)
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  const turn = page.getByRole('button', { name: 'Putar knob', exact: true })
  await turn.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: /Mesin sedang memilih/i })).toBeFocused()
  await turn.click({ force: true })
  await expect(page.getByText(/CYCLE 01/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' })).toBeEnabled()
  await page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' }).click()
  const dialog = page.getByRole('dialog', { name: 'You got a secret message.' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(turn).toBeFocused()
  expect(errors).toEqual([])
})

test('pointer knob dapat memulai cycle dan menunjukkan capsule-ready', async ({ page }) => {
  await openMachine(page)
  const knob = page.getByRole('button', { name: /Putar knob secara melingkar/i })
  const box = await knob.boundingBox()
  if (!box) throw new Error('Knob tidak ditemukan')
  const centerX = box.x + box.width / 2
  const centerY = box.y + box.height / 2
  await knob.dispatchEvent('pointerdown', { pointerId: 7, clientX: centerX + 20, clientY: centerY })
  await knob.dispatchEvent('pointermove', { pointerId: 7, clientX: centerX, clientY: centerY + 20 })
  await knob.dispatchEvent('pointermove', { pointerId: 7, clientX: centerX - 20, clientY: centerY })
  await knob.dispatchEvent('pointerup', { pointerId: 7, clientX: centerX - 20, clientY: centerY })
  await expect(page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' })).toBeEnabled()
})

test('delapan cycle tidak mengulang pesan dan deck berikutnya tetap dapat digunakan', async ({ page }) => {
  await openMachine(page)
  const messages = new Set<string>()
  for (let index = 0; index < 8; index += 1) {
    await turnWithButton(page)
    messages.add(await openAndClose(page))
  }
  expect(messages.size).toBe(8)
  await turnWithButton(page)
  await expect(page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' })).toBeEnabled()
})

test('reduced motion, overflow, decorative SVG, replay route lama, dan back navigation aman', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openMachine(page)
  await turnWithButton(page)
  await page.getByRole('button', { name: 'Buka kapsul pesan untuk Gusti' }).click()
  await expect(page.getByText('— Andre')).toBeVisible()
  await page.getByRole('button', { name: 'Simpan pesan ini' }).click()
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/secret-message-machine')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  }
  await page.goto('/heart-repair'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu hati yang perlu sedikit dirawat.')
  await page.goto('/lost-and-found'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa hal milikmu yang masih tersimpan di sini.')
  await page.goto('/midnight-radio'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu siaran yang hanya muncul saat dunia sudah tenang.')
  await page.goto('/secret-message-machine')
  await page.getByRole('link', { name: /Kembali ke koleksi/i }).click()
  await expect(page).toHaveURL('/')
  await page.goBack()
  await expect(page).toHaveURL('/secret-message-machine')
  for (const svg of await page.locator('svg').all()) { await expect(svg).toHaveAttribute('aria-hidden', 'true'); await expect(svg).toHaveAttribute('focusable', 'false') }
})
