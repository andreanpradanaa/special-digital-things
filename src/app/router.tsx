import { Route, Routes } from 'react-router'
import { HeartRepairPage } from '../pages/heart-repair/HeartRepairPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { ThemePlaceholderPage } from '../pages/ThemePlaceholderPage.tsx'
import { AppShell } from './AppShell.tsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route
          path="heart-repair"
          element={<HeartRepairPage />}
        />
        <Route
          path="lost-and-found"
          element={<ThemePlaceholderPage themeId="lost-and-found" />}
        />
        <Route
          path="midnight-radio"
          element={<ThemePlaceholderPage themeId="midnight-radio" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
