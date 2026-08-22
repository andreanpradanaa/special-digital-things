import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getRouteTitle } from '../app/themeRegistry.ts'

const siteTitle = 'Special Digital Things'

export function RouteAnnouncer() {
  const { pathname } = useLocation()
  const routeTitle = getRouteTitle(pathname)

  useEffect(() => {
    document.title = `${routeTitle} | ${siteTitle}`
  }, [routeTitle])

  return (
    <p className="visually-hidden" aria-atomic="true" aria-live="polite">
      {routeTitle}, halaman dimuat
    </p>
  )
}
