const WHATSAPP_NUMBER = '601172232047'
const MESSAGE = 'Hi AYUSYDAH, I would like some help with your supplements.'
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`

function WhatsAppLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M16.02 3.2a12.76 12.76 0 0 0-10.94 19.3L3.2 28.8l6.47-1.69A12.8 12.8 0 1 0 16.02 3.2Zm0 23.26c-2.05 0-4.06-.55-5.82-1.6l-.42-.25-3.84 1 1.03-3.74-.28-.44a10.43 10.43 0 1 1 9.33 5.03Z" />
      <path fill="currentColor" d="M22.1 18.62c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.2.22-.4.25-.73.08-1.98-.99-3.28-1.77-4.59-4.02-.35-.6.35-.56 1.01-1.87.11-.22.06-.41-.03-.57-.08-.17-.74-1.78-1.02-2.44-.27-.65-.55-.56-.74-.57h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.12-1.14 2.73 0 1.6 1.17 3.16 1.33 3.38.17.22 2.29 3.49 5.54 4.9.77.33 1.37.53 1.84.68.77.24 1.47.2 2.02.12.62-.09 1.95-.8 2.22-1.57.27-.78.27-1.45.19-1.58-.08-.14-.3-.22-.63-.39Z" />
    </svg>
  )
}

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AYUSYDAH on WhatsApp"
      className="fixed bottom-24 right-4 z-40 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-[0_8px_24px_rgba(37,211,102,0.38)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:shadow-[0_12px_28px_rgba(37,211,102,0.46)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 sm:bottom-24 sm:right-6 sm:h-14"
    >
      <WhatsAppLogo className="h-7 w-7 shrink-0" />
      <span className="hidden text-sm font-bold sm:inline">Chat with us</span>
    </a>
  )
}

export default WhatsAppButton
