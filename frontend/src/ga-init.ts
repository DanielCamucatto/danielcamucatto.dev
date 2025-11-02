// Lightweight GA4 initializer. This file is intentionally a top-level module
// so Vite will replace `import.meta.env.VITE_GA_MEASUREMENT_ID` at build time
// and the resulting bundle will contain the measurement id/config.

declare global {
  interface Window {
    dataLayer?: unknown[]
    // gtag signature is loose; use unknown[] to avoid `any` lint
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

// Debug logs to help trace build-time replacement and runtime behavior
console.log('[ga-init] import.meta.env.VITE_GA_MEASUREMENT_ID =', measurementId)

if (typeof window !== 'undefined' && measurementId) {
  console.log('[ga-init] running in browser and measurementId present, initializing GA', measurementId)
  // Inject gtag script
  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)
  if (!existing) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    s.onload = () => console.log('[ga-init] gtag script loaded')
    s.onerror = (e) => console.error('[ga-init] gtag script failed to load', e)
    document.head.appendChild(s)
  }

  // Minimal gtag shim
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...params: unknown[]) {
    ;(window.dataLayer as unknown[]).push(params)
    console.log('[ga-init] gtag called with', params)
  }

  // Initialize
  console.log('[ga-init] calling gtag js and config')
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true, debug_mode: false })
}

export {}
