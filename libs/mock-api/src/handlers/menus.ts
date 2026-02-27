import { http, HttpResponse, delay } from 'msw';
import menus from '../fixtures/menus.json';

const menuDataset = [...menus];

export const menuHandlers = [
  // Mock GET /api/v1/menus
  http.get('/api/v1/menus', async () => {
    await delay(500);
    return HttpResponse.json(menuDataset, { status: 200 });
  }),
];
