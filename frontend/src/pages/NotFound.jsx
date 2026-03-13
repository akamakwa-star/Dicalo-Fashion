import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="glass-panel px-6 py-10 animate-fade-up">
        <p className="chip mx-auto">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      </div>
      <Link
        to={ROUTES.HOME}
        className="btn-primary mt-6"
      >
        Go Home
      </Link>
    </section>
  );
}

export default NotFound;
