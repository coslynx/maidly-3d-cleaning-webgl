import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render the app:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = '<p>Failed to load the application. Please try again later.</p>'
  }
}