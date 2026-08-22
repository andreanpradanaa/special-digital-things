import { Route, Routes } from 'react-router'
import { HeartRepairPage } from '../pages/heart-repair/HeartRepairPage.tsx'
import { LostAndFoundPage } from '../pages/lost-and-found/LostAndFoundPage.tsx'
import { MidnightRadioPage } from '../pages/midnight-radio/MidnightRadioPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
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
          element={<LostAndFoundPage />}
        />
        <Route
          path="midnight-radio"
          element={<MidnightRadioPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
