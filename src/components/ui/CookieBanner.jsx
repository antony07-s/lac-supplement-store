import { useState } from 'react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'ayusydah-analytics-consent'
const LEGACY_CONSENT_KEY = 'ayusydah-cookie-notice-seen'

function readConsent() {
  const consent = localStorage.getItem(CONSENT_KEY)
  if (consent === 'accepted' || consent === 'rejected') return consent

  // A visitor who previously continued through the old notice had already opted in.
  if (localStorage.getItem(LEGACY_CONSENT_KEY) === 'true') {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    return 'accepted'
  }
  return null
}

function CookieBanner() {
  const [visible, setVisible] = useState(() => readConsent() === null)
  const choose = (consent) => {
    localStorage.setItem(CONSENT_KEY, consent)
    window.dispatchEvent(new Event('ayusydah-cookie-consent'))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-300"><div className="page-shell flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
      <p className="text-xs leading-5">
        We use essential cookies to run the store. Choose whether to allow optional analytics cookies. Read our{' '}
        <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link> and{' '}
        <Link to="/terms" className="underline hover:text-white">Terms &amp; Conditions</Link>.
      </p>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          onClick={() => choose('rejected')}
          className="rounded border border-gray-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
        >
          Essential only
        </button>
        <button
          onClick={() => choose('accepted')}
          className="rounded bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
        >
          Accept analytics
        </button>
      </div>
    </div></div>
  )
}

export default CookieBanner
