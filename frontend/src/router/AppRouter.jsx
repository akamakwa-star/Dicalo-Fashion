import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './paths';

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const Cart = lazy(() => import('../pages/Cart'));
const Login = lazy(() => import('../pages/Login'));
const Checkout = lazy(() => import('../pages/Checkout'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));

function AppRouter() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 text-slate-700">Loading page...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SHOP} element={<Shop />} />
          <Route
            path={ROUTES.CART}
            element={(
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            )}
          />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route
            path={ROUTES.CHECKOUT}
            element={(
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            )}
          />
          <Route
            path={ROUTES.ADMIN}
            element={(
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
