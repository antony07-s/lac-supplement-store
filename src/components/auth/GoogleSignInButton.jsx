import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const scriptId = 'google-identity-services'

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  const existing = document.getElementById(scriptId)
  if (existing) return new Promise((resolve, reject) => {
    existing.addEventListener('load', resolve, { once: true })
    existing.addEventListener('error', reject, { once: true })
  })
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function GoogleSignInButton({ onCredential, disabled = false }) {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || !containerRef.current) return undefined
    let active = true
    loadGoogleScript().then(() => {
      if (!active || !window.google?.accounts?.id || !containerRef.current) return
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredential, auto_select: false })
      window.google.accounts.id.renderButton(containerRef.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rect', width: 360, logo_alignment: 'left' })
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [clientId, onCredential])

  if (!clientId) return null
  return <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
    {loading && <div className="flex h-11 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-500"><Loader2 size={16} className="mr-2 animate-spin" />Loading Google…</div>}
    <div ref={containerRef} className={loading ? 'hidden' : 'w-full [&>div]:!w-full [&>div>div]:!w-full'} />
  </div>
}

export default GoogleSignInButton
