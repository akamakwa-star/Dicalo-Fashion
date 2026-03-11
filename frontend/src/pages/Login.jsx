import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginFailed, loginSuccess } from '../features/auth/authSlice';
import { fetchCart } from '../features/cart/cartSlice';
import BrandLogo from '../components/BrandLogo';
import { requestJson } from '../lib/api';
import { ROUTES } from '../router/paths';

const CSS = {
  page: 'mx-auto max-w-md px-4 py-10',
  card: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
  title: 'text-2xl font-bold text-slate-900',
  subtitle: 'mt-1 text-sm text-slate-600',
  form: 'mt-5 space-y-3',
  label: 'block text-sm font-medium text-slate-700',
  input: 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2',
  error: 'text-sm text-red-600',
  submitButton: 'w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800',
  footer: 'mt-4 text-sm text-slate-600',
  footerLink: 'font-semibold text-slate-900'
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector((state) => state.auth.error);
  const [email, setEmail] = useState('admin@dicalo.com');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      dispatch(loginFailed('Email and password are required'));
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestJson('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      dispatch(
        loginSuccess({
          user: result.user,
          accessToken: result.access_token
        })
      );
      dispatch(fetchCart());

      const requestedPath = location.state?.from;
      const destination = result.user?.role === 'admin' ? (requestedPath || ROUTES.ADMIN) : ROUTES.HOME;
      navigate(destination, { replace: true });
    } catch (error) {
      dispatch(loginFailed(error.message || 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={CSS.page}>
      <div className={CSS.card}>
        <BrandLogo className="mb-3" />
        <h1 className={CSS.title}>Sign In</h1>
        <p className={CSS.subtitle}>Sign in with your backend account credentials.</p>

        <form className={CSS.form} onSubmit={onSubmit}>
          <label className={CSS.label}>
            Email
            <input className={CSS.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className={CSS.label}>
            Password
            <input type="password" className={CSS.input} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {authError ? <p className={CSS.error}>{authError}</p> : null}
          <button className={CSS.submitButton} type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className={CSS.footer}>
          Back to <Link className={CSS.footerLink} to={ROUTES.HOME}>Home</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
