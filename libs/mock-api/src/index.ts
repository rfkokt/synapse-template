export const initMsw = async () => {
  if ((import.meta as any).env?.DEV) {
    const { worker } = await import('./browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
};

export { authHandlers } from './handlers/auth';
export { menuHandlers } from './handlers/menus';
