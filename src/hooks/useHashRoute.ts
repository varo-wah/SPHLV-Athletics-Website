import { useSyncExternalStore } from 'react';
function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
export function useHashRoute() {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '');
}
export function navigateHash(hash: string) {
  if (window.location.hash !== hash) window.location.hash = hash;
}
