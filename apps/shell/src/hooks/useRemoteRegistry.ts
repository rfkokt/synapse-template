import { useState, useEffect } from 'react';
import type { RemoteRegistry } from '../types/remote-registry';
import { fetchRemoteRegistry } from '../utils/remote-registry';

/**
 * React hook to access the remote registry.
 */
export function useRemoteRegistry() {
  const [registry, setRegistry] = useState<RemoteRegistry | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRemoteRegistry()
      .then((data) => {
        setRegistry(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        console.error('[RemoteRegistry] Failed to load:', err);
      });
  }, []);

  return { registry, error, isLoading };
}
