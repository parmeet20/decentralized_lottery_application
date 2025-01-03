import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GlobalContextProvider from './context/GlobalContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
)
