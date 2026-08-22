import { expect, test, type Page } from '@playwright/test'

const drawerFlow = [
  { id: 'sunday', label: 'SUNDAY', heading: 'Minggu sore itu masih ada di sini.' },
  { id: 'sound', label: 'SOUND', heading: 'Tawamu ternyata belum hilang.' },
  { id: 'home', label: 'HOME', heading: 'Ternyata rumah bukan selalu sebuah alamat.' },
  { id: 'courage', label: 'COURAGE', heading: 'Kamu pernah meninggalkan sedikit keberanian.' },
] as const

function collectPageErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

async function openVerification(page: Page) {
  await page.goto('/lost-and-found')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa hal milikmu yang masih tersimpan di sini.')
  await page.getByRole('button', { name: /Ambil tiket klaim/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tiket ini sudah menunggumu.')
  await page.getByRole('button', { name: /Periksa nomor klaim/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Catatan penyimpanan perlu satu nomor.')
}

async function openCabinet(page: Page) {
  await openVerification(page)
  await page.getByLabel('Nomor klaim pada tiket').fill('0427')
  await page.getByRole('button', { name: 'Verifikasi tiket' }).click()
  await expect(page.getByText('CLAIM VERIFIED')).toBeVisible()
  await page.getByRole('button', { name: /Buka kabinet/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Boleh periksa satu per satu.')
}

async function inspectAndReturn(page: Page, flow: (typeof drawerFlow)[number]) {
  const drawer = page.getByRole('button', { name: new RegExp(`Buka laci ${flow.label}`) })
  await drawer.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(flow.heading)
  await page.getByRole('button', { name: 'Kembalikan ke kabinet' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Boleh periksa satu per satu.')
  await expect(drawer).toBeFocused()
}

test('direct route dan ticket flow tersedia tanpa console error', async ({ page }) => {
  const errors = collectPageErrors(page)
  await openVerification(page)
  await expect(page.getByText('CLAIM NO. 0427')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('empty dan wrong claim tidak membuka kabinet', async ({ page }) => {
  await openVerification(page)
  await page.getByRole('button', { name: 'Verifikasi tiket' }).click()
  await expect(page.getByRole('alert')).toHaveText(/Masukkan nomor klaim/)
  await page.getByLabel('Nomor klaim pada tiket').fill('1111')
  await page.getByRole('button', { name: 'Verifikasi tiket' }).click()
  await expect(page.getByRole('alert')).toHaveText(/Nomor itu tidak tercatat/)
  await expect(page.getByRole('button', { name: /Buka kabinet/ })).toHaveCount(0)
})

test('drawer non-default dapat diperiksa, focus kembali, dan final unlock setelah empat record', async ({ page }) => {
  await openCabinet(page)
  const finalDrawer = page.getByRole('button', { name: /UNRETURNABLE/ })
  await expect(finalDrawer).toBeDisabled()
  await expect(finalDrawer).toContainText('4 RECORDS REQUIRED')

  for (const flow of drawerFlow) await inspectAndReturn(page, flow)

  await expect(finalDrawer).toBeEnabled()
  await expect(finalDrawer).toContainText('SEAL RELEASED')
  await expect(page.getByLabel('4 dari 4 record diperiksa')).toBeVisible()
})

test('keyboard-only dapat menuntaskan claim sampai receipt dan kembali ke kabinet', async ({ page }) => {
  await openVerification(page)
  const input = page.getByLabel('Nomor klaim pada tiket')
  await input.focus()
  await page.keyboard.type('0427')
  await page.getByRole('button', { name: 'Verifikasi tiket' }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: /Buka kabinet/ }).focus()
  await page.keyboard.press('Enter')

  for (const flow of drawerFlow) {
    const drawer = page.getByRole('button', { name: new RegExp(`Buka laci ${flow.label}`) })
    await drawer.focus()
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Kembalikan ke kabinet' }).focus()
    await page.keyboard.press('Enter')
  }

  await page.getByRole('button', { name: /UNRETURNABLE/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Barang terakhir tidak dapat dikembalikan.')
  await page.getByRole('button', { name: /Selesaikan klaim/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Klaim selesai.')
  await page.getByRole('button', { name: 'Buka kembali kabinet' }).click()
  await expect(page.getByRole('button', { name: /UNRETURNABLE/ })).toContainText('SEAL RELEASED')
})

test('replay, collection link, dan browser Back berfungsi', async ({ page }) => {
  await openCabinet(page)
  for (const flow of drawerFlow) await inspectAndReturn(page, flow)
  await page.getByRole('button', { name: /UNRETURNABLE/ }).click()
  await page.getByRole('button', { name: /Selesaikan klaim/ }).click()
  await page.getByRole('button', { name: 'Ulangi klaim' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada beberapa hal milikmu yang masih tersimpan di sini.')
  await page.getByRole('link', { name: 'Kembali ke koleksi' }).first().click()
  await expect(page).toHaveURL('/')
  await page.goBack()
  await expect(page).toHaveURL('/lost-and-found')
})

test('reduced motion, skip link, overflow, Heart Repair, dan Midnight Radio tidak regress', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/lost-and-found')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Lewati ke konten utama' })).toBeFocused()
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/lost-and-found')
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  }
  await page.goto('/heart-repair')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu hati yang perlu sedikit dirawat.')
  await page.goto('/midnight-radio')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada satu siaran yang hanya muncul saat dunia sudah tenang.')
})
