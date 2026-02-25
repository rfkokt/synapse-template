import React from 'react';

/**
 * Creates a lazy-loaded React component from a Module Federation remote.
 * 
 * Uses dynamic import() which the @module-federation/vite plugin intercepts.
 * The remote must be registered in vite.config.ts (build-time) or via
 * registerRemotes() (runtime).
 * 
 * Usage:
 *   const RemoteLogin = createRemoteComponent('authMfe', 'LoginPage');
 *   <Suspense fallback={<Loading />}><RemoteLogin /></Suspense>
 */
export function createRemoteComponent<T extends React.ComponentType<any>>(
  remoteName: string,
  exposedModule: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    // Dynamic import — intercepted by @module-federation/vite plugin
    const module = await __mf_dynamic_import__(remoteName, exposedModule);
    
    if (module && typeof module === 'object' && 'default' in module) {
      return module as { default: T };
    }
    
    return { default: module as unknown as T };
  });
}

/**
 * Runtime dynamic import helper.
 * Uses the federation runtime's import mechanism.
 */
async function __mf_dynamic_import__(remoteName: string, exposedModule: string) {
  // The @module-federation/vite plugin registers remotes and makes them
  // importable via standard dynamic import syntax: import('remoteName/module')
  // We use Function constructor to create a real dynamic import that the
  // Vite MF plugin can intercept.
  const module = await import(/* @vite-ignore */ `${remoteName}/${exposedModule}`);
  return module;
}
