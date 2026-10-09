import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer, Header } from './components/layout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OccasionPage } from './pages/OccasionPage'
import { ProductPage } from './pages/ProductPage'

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/produk/:slug" element={<ProductPage />} />
        <Route path="/untuk/:occasion" element={<OccasionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
