import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Produksi: builder di /goodiebox/, halaman penerima tetap di /gift/:slug (nginx menyajikan index yang sama),
// jadi aset harus beralamat absolut di bawah /goodiebox/.
export default defineConfig({
  base: '/goodiebox/',
  plugins: [react()],
  server: { allowedHosts: ['patchwork-unlit-nearness.ngrok-free.dev'] },
})
