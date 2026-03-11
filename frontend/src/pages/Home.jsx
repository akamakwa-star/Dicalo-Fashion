import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { ROUTES } from '../router/paths';

function Home() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:items-center">
      <div>
        <BrandLogo className="mb-4" />
        <p className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          Spring 2026 Collection
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          Style-first shopping built for speed.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Discover curated fashion pieces, manage your cart instantly, and explore analytics-ready admin insights.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={ROUTES.SHOP} className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Shop Now
          </Link>
          <Link to={ROUTES.ADMIN} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Admin Dashboard
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
          alt="Dicalo fashion showcase"
          className="h-[420px] w-full rounded-xl object-cover"
        />
      </div>
    </section>
  );
}

export default Home;
