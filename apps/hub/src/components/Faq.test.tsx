import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Faq } from './Faq'

describe('Faq', () => {
  test('item pertama terbuka, sisanya tertutup', () => {
    render(
      <Faq
        items={[
          { q: 'Berapa lama link aktif?', a: '30 hari.' },
          { q: 'Bisa diedit?', a: 'Tidak.' },
        ]}
      />,
    )
    const groups = screen.getAllByRole('group')
    expect(groups[0]).toHaveAttribute('open')
    expect(groups[1]).not.toHaveAttribute('open')
    expect(screen.getByText('30 hari.')).toBeInTheDocument()
  })
})
