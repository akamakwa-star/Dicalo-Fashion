import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

function BrandLogo({ className = '', compact = false }) {
  return (
    <Link to={ROUTES.HOME} className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <img
        src="/dicalo-logo.svg"
        alt="Dicalo logo"
        className={compact ? 'h-9 w-9 rounded-xl object-contain shadow-sm shadow-slate-900/10' : 'h-11 w-11 rounded-xl object-contain shadow-sm shadow-slate-900/10'}
      />
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight sm:text-xl">
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-orange-500 bg-clip-text text-transparent">
            Dicalo
          </span>
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Fashion</span>
      </span>
    </Link>
  );
}

export default BrandLogo;
