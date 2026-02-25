import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';

// Export the worker instance so we can start it in the frontend
export const worker = setupWorker(...authHandlers);
