/**
 * Remote Registry Types
 * Defines the shape of remotes.json — the config-driven remote discovery registry.
 */
export interface RemoteEntry {
  /** Module Federation remote name */
  name: string;
  /** URL to mf-manifest.json or remoteEntry.js */
  entry: string;
  /** Path prefix that activates this remote's routes */
  activeWhenPath: string;
  /** Map of exposed module names */
  exposes: Record<string, string>;
}

export interface RemoteRegistry {
  remotes: Record<string, RemoteEntry>;
}
