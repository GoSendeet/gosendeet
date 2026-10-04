const NEWSLETTER_EVENT = 'gosendeet:newsletter';
const subscriberKey = 'gosendeet:newsletter:subscribed';
const popupSeenKey = 'gosendeet:newsletter:popup-seen';
const fallbackFlags = new Set<string>();

function readFlag(key: string) {
  if (fallbackFlags.has(key)) return true;
  try { return localStorage.getItem(key) === 'yes'; } catch { return false; }
}

function writeFlag(key: string) {
  try {
    localStorage.setItem(key, 'yes');
    fallbackFlags.delete(key);
  } catch { fallbackFlags.add(key); }
}

export function hasSeenPopup() {
  return readFlag(popupSeenKey);
}

export function rememberPopupShown() {
  writeFlag(popupSeenKey);
}

export function isSubscribed() {
  return readFlag(subscriberKey);
}

export function rememberSubscription() {
  writeFlag(subscriberKey);
  window.dispatchEvent(new Event(NEWSLETTER_EVENT));
}

export function subscribeToNewsletterChanges(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === subscriberKey || event.key === null) listener();
  };
  window.addEventListener(NEWSLETTER_EVENT, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(NEWSLETTER_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}
