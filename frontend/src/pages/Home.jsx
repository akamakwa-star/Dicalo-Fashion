import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { ROUTES } from '../router/paths';

function Home() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6 animate-fade-up">
        <BrandLogo className="mb-2" />
        <span className="chip">Spring 2026 Collection</span>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
          Editorial edits, polished silhouettes, and a checkout flow that feels effortless.
        </h1>
        <p className="text-lg text-slate-600">
          Discover curated fashion pieces, manage your cart in real time, and keep product insights organized for
          the next drop.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.SHOP} className="btn-primary">
            Shop the Edit
          </Link>
          <Link to={ROUTES.ADMIN} className="btn-outline">
            Admin Dashboard
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Curated drops</p>
            <p className="mt-2 text-sm text-slate-700">Fresh arrivals weekly across every category.</p>
          </div>
          <div className="panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Fast checkout</p>
            <p className="mt-2 text-sm text-slate-700">Secure payments with instant order creation.</p>
          </div>
          <div className="panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Smart analytics</p>
            <p className="mt-2 text-sm text-slate-700">Monitor sales and product trends in one view.</p>
          </div>
        </div>
      </div>
      <div className="relative animate-fade-in" style={{ animationDelay: '120ms' }}>
        <div className="glass-panel p-4">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
            alt="Dicalo fashion showcase"
            className="h-[420px] w-full rounded-2xl object-cover"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-6 left-6 right-6 hidden sm:block">
          <div className="panel-soft flex items-center justify-between px-4 py-3 shadow-sm shadow-slate-900/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Free shipping</p>
              <p className="text-sm font-semibold text-slate-900">Orders over $150</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Customer rating</p>
              <p className="text-sm font-semibold text-slate-900">4.9 average</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
