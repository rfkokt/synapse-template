import { http, HttpResponse, delay } from 'msw';
import users from '../fixtures/users.json';

// Simulated database
const db = [...users];

export const authHandlers = [
  // Mock POST /api/v1/auth/login
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(800); // Simulate network latency
    const body = (await request.json()) as Record<string, unknown>;
    const email = body?.['email'] as string | undefined;
    const password = body?.['password'] as string | undefined;

    const user = db.find((u) => u.email === email && u.password === password);

    if (!user) {
      return HttpResponse.json(
        {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Email atau password salah',
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    // Exclude password from response
    const { password: _, ...userInfo } = user;

    return HttpResponse.json(
      {
        access_token: `mock_access_token_${Date.now()}`,
        user: userInfo,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `refresh_token=mock_refresh_token_${Date.now()}; HttpOnly; Path=/; SameSite=Strict`,
        },
      }
    );
  }),

  // Mock POST /api/v1/auth/refresh
  http.post('/api/v1/auth/refresh', async ({ cookies }) => {
    await delay(300);
    const refreshToken = cookies['refresh_token'];

    if (!refreshToken) {
      return HttpResponse.json(
        { code: 'AUTH_NO_REFRESH_TOKEN', message: 'Unauthorized', statusCode: 401 },
        { status: 401 }
      );
    }

    return HttpResponse.json(
      {
        access_token: `mock_access_token_refreshed_${Date.now()}`,
      },
      { status: 200 }
    );
  }),

  // Mock POST /api/v1/auth/logout
  http.post('/api/v1/auth/logout', async () => {
    await delay(300);
    return HttpResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
        },
      }
    );
  }),
];
