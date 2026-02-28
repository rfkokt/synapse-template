import { fetchRemoteRegistry } from './remote-registry';

interface FederationRuntimeRemote {
  name: string;
  entry: string;
  type: 'module';
}

interface FederationRuntimeInstance {
  options?: {
    name?: string;
    remotes?: FederationRuntimeRemote[];
  };
  registerRemotes: (remotes: FederationRuntimeRemote[], options?: { force?: boolean }) => void;
}

function normalizeEntry(entry: string): string {
  if (typeof window === 'undefined') {
    return entry;
  }

  try {
    return new URL(entry, window.location.origin).href;
  } catch {
    return entry;
  }
}

function getShellFederationInstance(): FederationRuntimeInstance | null {
  const globalFederation = (globalThis as { __FEDERATION__?: { __INSTANCES__?: unknown[] } })
    .__FEDERATION__;

  const instances = globalFederation?.__INSTANCES__;
  if (!Array.isArray(instances) || instances.length === 0) {
    return null;
  }

  const shellInstance =
    instances.find((instance) => {
      if (!instance || typeof instance !== 'object') {
        return false;
      }
      const maybeInstance = instance as FederationRuntimeInstance;
      return maybeInstance.options?.name === 'shell';
    }) ?? instances[0];

  return shellInstance as FederationRuntimeInstance;
}

async function waitForShellFederationInstance(
  maxWaitMs = 2_000,
  pollIntervalMs = 25
): Promise<FederationRuntimeInstance | null> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const instance = getShellFederationInstance();
    if (instance) {
      return instance;
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

/**
 * Registers remote entries from /remotes.json into the federation runtime.
 * This allows remote URLs to be changed via remotes.json without rebuilding shell.
 */
export async function registerRuntimeRemotesFromRegistry() {
  if (typeof window === 'undefined') {
    return;
  }

  const registry = await fetchRemoteRegistry();
  const remotes = Object.values(registry.remotes)
    .filter((remote) => Boolean(remote.name) && Boolean(remote.entry))
    .map(
      (remote): FederationRuntimeRemote => ({
        name: remote.name,
        entry: remote.entry,
        type: 'module',
      })
    );

  if (remotes.length === 0) {
    return;
  }

  const runtimeInstance = await waitForShellFederationInstance();
  if (!runtimeInstance) {
    console.warn('[RemoteRegistry] Federation runtime not ready, using fallback remotes');
    return;
  }

  const existingRemotes = runtimeInstance.options?.remotes ?? [];
  const existingRemoteByName = new Map(existingRemotes.map((remote) => [remote.name, remote]));

  const remotesToRegister = remotes.filter((remote) => {
    const existingRemote = existingRemoteByName.get(remote.name);
    if (!existingRemote) {
      return true;
    }

    return normalizeEntry(existingRemote.entry) !== normalizeEntry(remote.entry);
  });

  if (remotesToRegister.length === 0) {
    return;
  }

  runtimeInstance.registerRemotes(remotesToRegister, { force: true });
}
