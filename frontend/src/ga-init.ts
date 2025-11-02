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

if (typeof window !== 'undefined' && measurementId) {
  // Inject gtag script
  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)
  if (!existing) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(s)
  }

  // Minimal gtag shim
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...params: unknown[]) {
    // push the call args as an array into dataLayer
    ;(window.dataLayer as unknown[]).push(params)
  }

  // Initialize
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: true, debug_mode: false })
}

export {}
