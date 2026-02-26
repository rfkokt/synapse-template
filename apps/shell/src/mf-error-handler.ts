import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

/**
 * A Module Federation runtime plugin that intercepts remote loading errors.
 * Instead of throwing an error that crashes the entire host application (e.g. blank white screen),
 * this plugin catches the error and provides a fallback component.
 *
 * This ensures fault tolerance: if one MFE (e.g. docs-mfe on port 4003) is down,
 * the shell (port 4000) and other active MFEs continue to function normally.
 * The broken route will trigger the ErrorFallback UI via the `<ErrorBoundary>`
 * inside `RemoteLoader.tsx`.
 */
const offlineHandlingPlugin: () => ModuleFederationRuntimePlugin = () => ({
  name: 'offline-handling-plugin',
  errorLoadRemote(args) {
    const { id, error } = args;
    console.warn(`[Federation Runtime] Failed to load remote ${id}:`, error);

    // Return a mock/fallback module so the federation runtime doesn't crash completely.
    // We throw an explicit Error here so that React Suspense/ErrorBoundary
    // can catch it and display a generic ErrorFallback UI for this specific MFE.
    return {
      default: () => {
        throw new Error(`Micro Frontend (${id}) is currently unavailable or offline.`);
      },
    };
  },
});

export default offlineHandlingPlugin;
