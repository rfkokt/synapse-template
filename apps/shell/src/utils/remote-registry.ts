import type { RemoteRegistry } from '../types/remote-registry';

const REGISTRY_URL = '/remotes.json';

let cachedRegistry: RemoteRegistry | null = null;

/**
 * Fetches and memoizes the remote registry from /remotes.json.
 */
export async function fetchRemoteRegistry(): Promise<RemoteRegistry> {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  const response = await fetch(REGISTRY_URL);
  if (!response.ok) {
    throw new Error(`Failed to load remote registry: ${response.status}`);
  }

  cachedRegistry = (await response.json()) as RemoteRegistry;
  return cachedRegistry;
}
