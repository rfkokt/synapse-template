/**
 * MFE Event Contracts
 * All cross-MFE events use namespaced custom browser events.
 */
export declare const MFE_EVENTS: {
  readonly AUTH: {
    readonly USER_LOGGED_IN: 'Synapse:auth:user_logged_in';
    readonly USER_LOGGED_OUT: 'Synapse:auth:user_logged_out';
    readonly TOKEN_REFRESHED: 'Synapse:auth:token_refreshed';
  };
  readonly BUSINESS: {
    readonly ORDER_CREATED: 'Synapse:business:order_created';
  };
};
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
export declare function dispatchMfeEvent<T>(eventName: string, detail: T): void;
/**
 * Helper to listen to typed MFE events
 */
export declare function onMfeEvent<T>(eventName: string, handler: (detail: T) => void): () => void;
//# sourceMappingURL=events.d.ts.map
