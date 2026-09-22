// Provider-neutral events. If Google Tag Manager is installed, events are
// automatically available through dataLayer; otherwise they remain usable by
// any later analytics integration without collecting personal information.
export function trackEvent(name, properties = {}) {
  const event = { event: name, ...properties }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
  window.dispatchEvent(new CustomEvent('ayusydah:analytics', { detail: event }))
}

export function reportError(error, context = {}) {
  const detail = { message: error?.message || String(error), ...context }
  window.dispatchEvent(new CustomEvent('ayusydah:error', { detail }))
  if (import.meta.env.DEV) console.error('Application error', detail)
}
