import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Loading component while i18n resources are loading
const Loading = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </StrictMode>,
)
