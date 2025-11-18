import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import '@/styles.css'
import App from './App.tsx'
import ComponentLibrary from '@/pages/ComponentLibrary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/components" element={<ComponentLibrary onBack={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
