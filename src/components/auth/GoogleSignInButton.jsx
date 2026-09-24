import { useEffect, useRef, useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'

const scriptId = 'google-identity-services'
let scriptPromise
let initializedClientId
let activeCredentialHandler

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  const existing = document.getElementById(scriptId)
  scriptPromise = new Promise((resolve, reject) => {
    if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', reject, { once: true }); return }
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => { scriptPromise = undefined; reject(new Error('Google Identity Services failed to load')) }
    document.head.appendChild(script)
  })
  return scriptPromise
}

function initializeGoogle(clientId) {
  if (initializedClientId === clientId) return
  window.google.accounts.id.initialize({ client_id: clientId, callback: (response) => activeCredentialHandler?.(response), auto_select: false })
  initializedClientId = clientId
}

function GoogleSignInButton({ onCredential, disabled = false }) {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || !containerRef.current) return undefined
    let active = true
    activeCredentialHandler = onCredential
    loadGoogleScript().then(() => {
      if (!active || !window.google?.accounts?.id || !containerRef.current) return
      initializeGoogle(clientId)
      containerRef.current.replaceChildren()
      window.google.accounts.id.renderButton(containerRef.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rect', width: 360, logo_alignment: 'left' })
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false; if (activeCredentialHandler === onCredential) activeCredentialHandler = undefined }
  }, [clientId, onCredential])

  if (!clientId) return null
  return <div className={`rounded-xl border border-stone-200 bg-stone-50 p-2 shadow-sm ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
    {loading && <div className="flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm text-gray-500"><Loader2 size={16} className="mr-2 animate-spin" />Loading Google…</div>}
    <div ref={containerRef} className={loading ? 'hidden' : 'w-full [&>div]:!w-full [&>div>div]:!w-full'} />
    {!loading && <p className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-stone-500"><ShieldCheck size={13} className="text-brand-blue" />Secure sign-in powered by Google</p>}
  </div>
}

export default GoogleSignInButton
