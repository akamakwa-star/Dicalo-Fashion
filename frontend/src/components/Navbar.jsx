import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import BrandLogo from './BrandLogo';
import { ROUTES } from '../router/paths';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const signOut = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <BrandLogo compact />
        <nav className="flex items-center gap-2 text-sm sm:gap-4 sm:text-base">
          <NavLink to={ROUTES.HOME} className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-600')}>Home</NavLink>
          <NavLink to={ROUTES.SHOP} className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-600')}>Shop</NavLink>
          {isAdmin ? <NavLink to={ROUTES.ADMIN} className={({ isActive }) => (isActive ? 'font-semibold text-slate-900' : 'text-slate-600')}>Admin</NavLink> : null}
          <NavLink to={ROUTES.CART} className="rounded-full bg-amber-400 px-3 py-1 font-semibold text-slate-900">Cart ({totalQuantity})</NavLink>
          {isAuthenticated ? (
            <button onClick={signOut} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700">
              Sign out ({user?.email || 'user'})
            </button>
          ) : (
            <NavLink to={ROUTES.LOGIN} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700">Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
