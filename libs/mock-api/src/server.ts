import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';
import { menuHandlers } from './handlers/menus';

// Export the server instance so we can start it in our testing environment
export const server = setupServer(...authHandlers, ...menuHandlers);
