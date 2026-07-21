import { useState } from 'react'

function CookieBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-300"><div className="page-shell flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
      <p className="text-xs leading-5">
        Cookies allow us to optimise and personalise your experience. By continuing to use the website, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-white">Privacy Policy</span> and{' '}
        <span className="underline cursor-pointer hover:text-white">Terms & Conditions</span>.
      </p>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 border border-gray-500 text-white text-sm font-semibold px-6 py-2 rounded hover:bg-white hover:text-gray-900 transition-colors"
      >
        CONTINUE
      </button>
    </div></div>
  )
}

export default CookieBanner
