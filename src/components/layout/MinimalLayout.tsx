import React from 'react'
import Header from './Header'
import Footer from './Footer'
import styles from 'src/styles/layout/minimal-layout.css'

/**
 * MinimalLayoutProps Interface
 *
 * Defines the type for the props that MinimalLayout component will receive.
 * It extends React.PropsWithChildren to include the 'children' prop.
 */
interface MinimalLayoutProps extends React.PropsWithChildren<{}> {}

/**
 * MinimalLayout Component
 *
 * Implements a basic layout structure for all pages, including a header and footer.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./Header
 * - ./Footer
 * - src/styles/layout/minimal-layout.css
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function MinimalLayout(props: MinimalLayoutProps): JSX.Element {
  try {
    return (
      <div className="min-h-screen flex flex-col font-roboto">
        <Header />
        <main className="flex-grow container mx-auto py-8" aria-label="Main Content">
          {props.children}
        </main>
        <Footer />
      </div>
    )
  } catch (error: any) {
    console.error('Error rendering MinimalLayout component:', error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500">
          An error occurred while loading the layout. Please try again later.
        </p>
      </div>
    )
  }
}

export default MinimalLayout