export const API = {
  auth: {
    login: () => '/api/v1/auth/login',
    refresh: () => '/api/v1/auth/refresh',
    logout: () => '/api/v1/auth/logout',
    register: () => '/api/v1/auth/register',
  },
  user: {
    profile: () => '/api/v1/user/profile',
    update: (id: string) => `/api/v1/user/${id}`,
  },
  business: {
    orders: () => '/api/v1/orders',
    detail: (id: string) => `/api/v1/orders/${id}`,
  },
  menu: {
    list: () => '/api/v1/menus',
  },
} as const;
