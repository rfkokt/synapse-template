import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { menuHandlers } from './handlers/menus';

// Export the worker instance so we can start it in the frontend
export const worker = setupWorker(...authHandlers, ...menuHandlers);
