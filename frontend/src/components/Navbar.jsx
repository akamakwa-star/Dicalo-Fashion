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
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <BrandLogo compact />

        <nav className="order-3 w-full rounded-full bg-white/70 p-1 text-sm shadow-sm shadow-slate-900/5 sm:order-none sm:w-auto">
          <div className="flex flex-wrap items-center gap-1">
            <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`.trim()}
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.SHOP}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`.trim()}
            >
              Shop
            </NavLink>
            {isAdmin ? (
              <NavLink
                to={ROUTES.ADMIN}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`.trim()}
              >
                Admin
              </NavLink>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to={ROUTES.CART} className="btn-accent gap-2">
            Cart
            <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-semibold text-white">
              {totalQuantity}
            </span>
          </NavLink>
          {isAuthenticated ? (
            <button onClick={signOut} className="btn-outline">
              Sign out ({user?.email || 'user'})
            </button>
          ) : (
            <NavLink to={ROUTES.LOGIN} className="btn-outline">
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
