import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll saat pindah halaman; kalau ada #hash, scroll ke elemennya. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}
