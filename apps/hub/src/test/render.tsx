import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

/** Render elemen di dalam router dengan rute awal tertentu. */
export function renderAt(path: string, ui: ReactElement) {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

/** Render satu halaman pada pola rute tertentu, mis. renderRoute('/produk/:slug', '/produk/goodiebox', <ProductPage />). */
export function renderRoute(pattern: string, path: string, element: ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={pattern} element={element} />
      </Routes>
    </MemoryRouter>,
  )
}
