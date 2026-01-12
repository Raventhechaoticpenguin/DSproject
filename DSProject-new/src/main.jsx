import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styling/index.css'
import App from './App.jsx'
import { AudioProvider } from './AudioContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <App />
      </AudioProvider>
    </BrowserRouter>
  </StrictMode>,
)
