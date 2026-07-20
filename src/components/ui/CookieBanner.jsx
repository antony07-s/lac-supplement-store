import { useState } from 'react'

function CookieBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-300 px-8 py-4 flex items-center justify-between gap-6 z-50">
      <p className="text-xs">
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
    </div>
  )
}

export default CookieBanner