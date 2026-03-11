import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

function BrandLogo({ className = '', compact = false }) {
  return (
    <Link to={ROUTES.HOME} className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <img
        src="/dicalo-logo.svg"
        alt="Dicalo logo"
        className={compact ? 'h-9 w-9 rounded-md object-contain' : 'h-11 w-11 rounded-md object-contain'}
      />
      <span className="leading-tight">
        <span className="block text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Dicalo</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fashion</span>
      </span>
    </Link>
  );
}

export default BrandLogo;
