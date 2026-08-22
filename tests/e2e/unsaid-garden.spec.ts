import { expect, test, type Page } from '@playwright/test'

const seeds = ['MOONFLOWER', 'BELLFLOWER', 'CLOVER'] as const

async function openTray(page: Page) {
  await page.goto('/unsaid-garden')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa kata yang belum siap diucapkan—jadi aku menanamnya.')
  await page.getByRole('button', { name: /Buka rumah kaca/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pilih satu benih yang belum kamu kenal.')
}

async function growSeed(page: Page, seed: string) {
  await page.getByRole('button', { name: `Pilih benih ${seed}` }).click()
  await page.getByRole('button', { name: /Tanam benih ini/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Beberapa kata hanya membutuhkan sedikit perawatan.')
  await page.getByRole('button', { name: /Siram benih/i }).click()
  await page.getByRole('button', { name: /Beri cahaya/i }).click()
  await page.getByRole('button', { name: /Biarkan ia mekar/i }).click()
}

test('route, skip link, dan gallery featured pertama tersedia', async ({ page }) => {
  await page.goto('/unsaid-garden')
  const skip = page.getByRole('link', { name: 'Lewati ke konten utama' })
  expect(await skip.evaluate((element) => element.getBoundingClientRect().bottom <= 0)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await page.goto('/')
  const links = page.getByRole('navigation').getByRole('link')
  await expect(links).toHaveCount(4)
  await expect(links.first()).toHaveAccessibleName(/The Unsaid Garden/)
  await links.first().focus()
  await expect(links.first()).toBeFocused()
})

test('button alternative, keyboard care, and bloom guards work', async ({ page }) => {
  await openTray(page)
  await page.getByRole('button', { name: 'Pilih benih MOONFLOWER' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.getByRole('button', { name: /Tanam benih ini/i }).click()
  await expect(page.getByRole('button', { name: /Biarkan ia mekar/i })).toBeDisabled()
  await page.getByRole('button', { name: /Beri cahaya/i }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: /Siram benih/i }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: /Biarkan ia mekar/i })).toBeEnabled()
  await page.getByRole('button', { name: /Biarkan ia mekar/i }).click()
  await expect(page.getByText('Aku suka versi diriku yang muncul ketika sedang bersamamu.').last()).toBeVisible()
})

test('drag planting, three unique blooms, herbarium, replay, and collection work', async ({ page }) => {
  await openTray(page)
  await page.getByRole('button', { name: 'Pilih benih MOONFLOWER' }).click()
  const packet = page.getByRole('button', { name: /Geser benih MOONFLOWER/i })
  const target = page.getByTestId('garden-soil-target')
  const packetBox = await packet.boundingBox(); const targetBox = await target.boundingBox()
  if (!packetBox || !targetBox) throw new Error('Target planting tidak ditemukan')
  await page.mouse.move(packetBox.x + packetBox.width / 2, packetBox.y + packetBox.height / 2); await page.mouse.down(); await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 8 }); await page.mouse.up()
  await page.getByRole('button', { name: /Siram benih/i }).click(); await page.getByRole('button', { name: /Beri cahaya/i }).click(); await page.getByRole('button', { name: /Biarkan ia mekar/i }).click(); await page.getByRole('button', { name: /Simpan dan pilih/i }).click()
  for (const seed of seeds.slice(1)) { await growSeed(page, seed); if (seed !== 'CLOVER') await page.getByRole('button', { name: /Simpan dan pilih/i }).click() }
  await expect(page.getByRole('button', { name: /Buka herbarium/i })).toBeEnabled()
  await page.getByRole('button', { name: /Buka herbarium/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tidak semua yang terlambat dikatakan berarti kurang sungguh-sungguh.')
  await expect(page.getByText('SPECIMEN 01 / MOONFLOWER')).toBeVisible()
  await page.getByRole('button', { name: /Tumbuhkan lagi/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa kata yang belum siap diucapkan—jadi aku menanamnya.')
  await page.getByRole('link', { name: 'Kembali ke koleksi' }).first().click()
  await expect(page).toHaveURL('/')
})

test('reduced motion, SVG accessibility, overflow, and existing themes remain intact', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openTray(page)
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 800 }]) { await page.setViewportSize(viewport); await page.goto('/unsaid-garden'); expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false) }
  await page.goto('/heart-repair'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu hati yang perlu sedikit dirawat.')
  await page.goto('/lost-and-found'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa hal milikmu yang masih tersimpan di sini.')
  await page.goto('/midnight-radio'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu siaran yang hanya muncul saat dunia sudah tenang.')
  for (const svg of await page.locator('svg').all()) { await expect(svg).toHaveAttribute('aria-hidden', 'true'); await expect(svg).toHaveAttribute('focusable', 'false') }
})
