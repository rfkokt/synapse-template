import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';

// Export the server instance so we can start it in our testing environment
export const server = setupServer(...authHandlers);
