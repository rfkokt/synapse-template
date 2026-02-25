/**
 * MFE Event Contracts
 * All cross-MFE events use namespaced custom browser events.
 */

export const MFE_EVENTS = {
  AUTH: {
    USER_LOGGED_IN: 'antygraviti:auth:user_logged_in',
    USER_LOGGED_OUT: 'antygraviti:auth:user_logged_out',
    TOKEN_REFRESHED: 'antygraviti:auth:token_refreshed',
  },
  BUSINESS: {
    ORDER_CREATED: 'antygraviti:business:order_created',
  },
} as const;

export interface AuthEventPayload {
  userId: string;
  accessToken: string;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

/**
 * Helper to dispatch typed MFE events
 */
export function dispatchMfeEvent<T>(eventName: string, detail: T): void {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Helper to listen to typed MFE events
 */
export function onMfeEvent<T>(
  eventName: string,
  handler: (detail: T) => void
): () => void {
  const listener = (e: Event) => {
    handler((e as CustomEvent<T>).detail);
  };
  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
