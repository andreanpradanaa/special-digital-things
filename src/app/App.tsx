import { BrowserRouter } from 'react-router'
import { AppRoutes } from './router.tsx'

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
