import BrandLogo from './BrandLogo';

function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
        <div>
          <BrandLogo />
          <p className="mt-3 max-w-sm text-slate-600">
            Curated fashion drops, effortless checkout, and a calm shopping flow designed for modern wardrobes.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Collections</p>
          <p className="mt-3">Women, Men, Accessories, Footwear</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Operations</p>
          <p className="mt-3">Inventory synced daily. Orders processed within 24 hours.</p>
        </div>
      </div>
      <div className="border-t border-white/70 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500">
          <p>© 2026 Dicalo Fashion. All rights reserved.</p>
          <p>Designed for mobile + desktop.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
