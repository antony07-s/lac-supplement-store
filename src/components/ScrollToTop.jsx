import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If the URL includes a #section (e.g. /#best-sellers), scroll to that
    // element instead of jumping to the top of the page.
    if (hash) {
      const id = hash.replace('#', '')
      // Wait a tick so the target section has rendered before we scroll to it.
      const timeout = setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 0)
      return () => clearTimeout(timeout)
    }

    // No hash present — normal page navigation, scroll to top as before.
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop