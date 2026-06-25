// Analytics placeholder — replace with real GA4 / Plausible / Mixpanel key
const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID;

export function initAnalytics() {
  if (ANALYTICS_ID && typeof window !== 'undefined') {
    // Google Analytics 4 example
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', ANALYTICS_ID);
  }
}

export function trackPageView(path) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
}

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

// Sentry-style error logging (lightweight, no SDK needed for MVP)
export function logError(error, context = {}) {
  const payload = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // In production, POST to your error-tracking endpoint
  if (import.meta.env.PROD) {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  console.error('[Analytics Error]', payload);
}
