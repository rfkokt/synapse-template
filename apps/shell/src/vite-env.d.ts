/// <reference types="vite/client" />

declare module 'authMfe/LoginPage' {
  const LoginPage: React.ComponentType;
  export default LoginPage;
}

declare module 'authMfe/RegisterPage' {
  const RegisterPage: React.ComponentType;
  export default RegisterPage;
}

declare module 'authMfe/ProfilePage' {
  const ProfilePage: React.ComponentType;
  export default ProfilePage;
}
declare module 'authMfe/routes' {
  import type { RouteObject } from 'react-router-dom';
  export const authRoutes: RouteObject[];
}

declare module 'businessmfe/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'docsmfe/App' {
  const App: React.ComponentType;
  export default App;
}
