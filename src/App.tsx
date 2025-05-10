import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import MinimalLayout from './components/layout/MinimalLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const ModelShowcasePage = lazy(() => import('./pages/ModelShowcasePage'))

/**
 * App Component
 *
 * This is the root component of the application. It sets up the React Router
 * and defines the routes for the different pages. It also uses React.lazy and
 * Suspense for code splitting and to improve the initial load time of the
 * application.
 *
 * Dependencies:
 * - react@19.1.0
 * - react-router-dom
 * - ./styles/index.css
 * - ./components/layout/MinimalLayout
 * - ./pages/HomePage
 * - ./pages/AboutPage
 * - ./pages/ContactPage
 * - ./pages/ExperiencePage
 * - ./pages/ModelShowcasePage
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<MinimalLayout><HomePage /></MinimalLayout>} />
            <Route path="/about" element={<MinimalLayout><AboutPage /></MinimalLayout>} />
            <Route path="/contact" element={<MinimalLayout><ContactPage /></MinimalLayout>} />
            <Route path="/experience" element={<MinimalLayout><ExperiencePage /></MinimalLayout>} />
            <Route path="/modelshowcase" element={<MinimalLayout><ModelShowcasePage /></MinimalLayout>} />
            <Route path="*" element={<MinimalLayout><div>Page not found</div></MinimalLayout>} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  )
}

function ErrorBoundary({ children }: { children: React.ReactNode }): JSX.Element {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const errorHandler = (error: Error, info: React.ErrorInfo): void => {
      console.error('ErrorBoundary caught an error: ', error, info)
      setHasError(true)
    }

    window.addEventListener('error', errorHandler)

    return () => {
      window.removeEventListener('error', errorHandler)
    }
  }, [])


  if (hasError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="text-gray-500">We are sorry, but an unexpected error occurred.</p>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    )
  }

  return children
}

export default App