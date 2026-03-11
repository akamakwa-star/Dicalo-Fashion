import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 inline-flex rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go Home
      </Link>
    </section>
  );
}

export default NotFound;

