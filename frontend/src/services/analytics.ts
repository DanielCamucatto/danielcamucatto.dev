/* Lightweight Google Analytics (GA4) helper
   - Dynamically injects gtag script only when a measurement ID is provided
   - Exposes initGA, pageview and event helpers
   - Does nothing when running outside the browser or when GA is not configured
*/

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export function initGA(measurementId?: string) {
  if (!isBrowser) {
    console.log('[analytics] not in browser, skipping initGA')
    return
  }
  if (!measurementId) {
    console.log('[analytics] no measurementId provided, skipping initGA')
    return
  }
  if (window.gtag) {
    console.log('[analytics] window.gtag already defined, skipping initGA')
    return // already initialized
  }

  console.log('[analytics] initializing GA with', measurementId)

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
    console.log('[analytics] gtag called with', args)
  }

  window.gtag = gtag;

  // Immediately call the gtag function with 'js' and the current date
  gtag('js', new Date());

  // Call the gtag function with 'config' and the measurement ID
  gtag('config', measurementId, {
    send_page_view: true,
    debug_mode: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  // Create script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  script.onload = () => {
    console.log('[analytics] gtag script loaded')
  }
  
  script.onerror = (e) => {
    console.error('[analytics] gtag script failed to load', e)
  }
  
  document.head.appendChild(script)

}

export function pageview(path: string) {
  if (!isBrowser) return
  if (!window.gtag) {
    
    return
  }
  try {
    window.gtag('event', 'page_view', { page_path: path })
  } catch {
    // noop - silently fail if gtag is blocked
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
  } catch {
    // noop
  }
}

export default {
  initGA,
  pageview,
  event,
}
