import { createBrowserRouter } from 'react-router';
import { adminRoutes } from './adminRoutes';
import { publicRoutes } from './publicRoutes';

// Combine all routes
export const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
]);

export default router;