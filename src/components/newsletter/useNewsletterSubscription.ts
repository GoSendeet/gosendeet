import { useSyncExternalStore } from 'react';
import { isSubscribed, subscribeToNewsletterChanges } from './preferences';

export function useNewsletterSubscription() {
  return useSyncExternalStore(subscribeToNewsletterChanges, isSubscribed, () => false);
}
