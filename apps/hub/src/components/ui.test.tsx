import { describe, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from '../test/render'
import { Badge, Button, Chip } from './ui'

describe('Button', () => {
  test('href eksternal dirender sebagai <a>', () => {
    renderAt('/', <Button href="https://contoh.id/goodiebox">Buka</Button>)
    const link = screen.getByRole('link', { name: 'Buka' })
    expect(link).toHaveAttribute('href', 'https://contoh.id/goodiebox')
  })

  test('to internal dirender sebagai link router', () => {
    renderAt('/', <Button to="/produk/goodiebox">Detail</Button>)
    expect(screen.getByRole('link', { name: 'Detail' })).toHaveAttribute('href', '/produk/goodiebox')
  })

  test('tanpa href/to dirender sebagai <button> dan memanggil onClick', async () => {
    const onClick = vi.fn()
    renderAt('/', <Button onClick={onClick}>Klik</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Klik' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('disabled tidak memanggil onClick', async () => {
    const onClick = vi.fn()
    renderAt(
      '/',
      <Button onClick={onClick} disabled variant="secondary" size="small" full>
        Klik
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Klik' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Chip', () => {
  test('chip aktif menandai aria-current', () => {
    renderAt(
      '/',
      <Chip to="/untuk/romantis" active>
        Romantis
      </Chip>,
    )
    expect(screen.getByRole('link', { name: 'Romantis' })).toHaveAttribute('aria-current', 'page')
  })

  test('chip tanpa link hanya teks', () => {
    renderAt('/', <Chip>Surat</Chip>)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('Surat')).toBeInTheDocument()
  })
})

describe('Badge', () => {
  test('menampilkan label', () => {
    renderAt('/', <Badge tone="sage">Tersedia</Badge>)
    expect(screen.getByText('Tersedia')).toBeInTheDocument()
  })
})
