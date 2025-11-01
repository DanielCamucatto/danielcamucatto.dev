/* Lightweight Google Analytics (GA4) helper
   - Dynamically injects gtag script only when a measurement ID is provided
   - Exposes initGA, pageview and event helpers
   - Does nothing when running outside the browser or when GA is not configured
*/

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export function initGA(measurementId?: string) {
  if (!isBrowser) {
    console.log('[GA] Not in browser environment')
    return
  }
  if (!measurementId) {
    console.log('[GA] No measurement ID provided')
    return
  }
  if (window.gtag) {
    console.log('[GA] Already initialized')
    return // already initialized
  }

  console.log('[GA] Initializing with ID:', measurementId)
  
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    // push a real array copy of args to match GA expectation
    window.dataLayer!.push(Array.prototype.slice.call(args))
  }
  window.gtag = gtag as any

  // create script tag
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  
  script.onload = () => {
    console.log('[GA] Script loaded successfully')
    // Wait a bit for gtag to be fully ready
    setTimeout(() => {
      if (window.gtag) {
        window.gtag('js', new Date())
        window.gtag('config', measurementId, {
          send_page_view: true,
          debug_mode: true,
          cookie_flags: 'SameSite=None;Secure'
        })
        console.log('[GA] gtag configured')
        
        // Send test event
        setTimeout(() => {
          if (window.gtag) {
            window.gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            })
            console.log('[GA] page_view event sent')
            
            // Check if dataLayer has events
            console.log('[GA] dataLayer:', window.dataLayer)
          }
        }, 500)
      }
    }, 100)
  }
  
  script.onerror = () => {
    console.error('[GA] Failed to load gtag script')
  }
  
  document.head.appendChild(script)

  console.log('[GA] Script tag added to head')
}

export function pageview(path: string) {
  if (!isBrowser) return
  if (!window.gtag) {
    console.log('[GA] pageview called but gtag not initialized')
    return
  }
  try {
    console.log('[GA] Sending pageview:', path)
    window.gtag('event', 'page_view', { page_path: path })
  } catch (e) {
    console.error('[GA] Error sending pageview:', e)
  }
}

export function event(params: {
  action: string
  category?: string
  label?: string
  value?: number
}) {
  if (!isBrowser) return
  if (!window.gtag) return
  const { action, category, label, value } = params
  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  } catch (e) {
    // noop
  }
}

export default {
  initGA,
  pageview,
  event,
}
