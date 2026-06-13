const ENDPOINT = '/api/event';

export function track(eventName) {
  const payload = JSON.stringify({ e: eventName });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
  } else {
    fetch(ENDPOINT, { method: 'POST', body: payload,
      headers: { 'Content-Type': 'application/json' }, keepalive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  track('page_view:' + window.location.pathname);
});
