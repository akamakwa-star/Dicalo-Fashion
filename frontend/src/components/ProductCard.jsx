import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

const CSS = {
  card: 'glass-panel group flex h-full flex-col p-4 text-slate-900 transition duration-300 hover:-translate-y-1 hover:shadow-xl',
  imageWrap: 'flex h-52 items-center justify-center rounded-2xl bg-white/70 p-3',
  image: 'h-full w-full object-contain transition duration-300 group-hover:scale-105',
  content: 'mt-4 flex flex-1 flex-col',
  title: 'line-clamp-2 text-[15px] font-semibold leading-5 text-slate-900',
  ratingRow: 'mt-2 flex items-center gap-2 text-sm leading-none',
  ratingCount: 'text-slate-500',
  price: 'mt-3 text-2xl font-semibold leading-none text-slate-900',
  dollarSign: 'align-top text-sm',
  delivery: 'mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700',
  category: 'mt-1 text-xs text-slate-600',
  seller: 'mt-1 text-xs text-slate-500',
  sourceLink: 'mt-2 text-xs font-semibold text-orange-600 hover:text-orange-500',
  addButton: 'btn-soft mt-4 w-full'
};

const renderStars = (rating) => {
  const value = Math.max(0, Math.min(5, Number(rating || 0)));
  const fullStars = Math.round(value);

  return '★★★★★'.split('').map((star, index) => (
    <span key={`${star}-${index}`} className={index < fullStars ? 'text-amber-500' : 'text-slate-300'}>
      ★
    </span>
  ));
};

function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4);
  const reviews = Number(product.reviews || Math.floor(rating * 42));
  const delay = `${Math.min(index, 8) * 70}ms`;

  return (
    <article className={`${CSS.card} animate-fade-up`} style={{ animationDelay: delay }}>
      <div className={CSS.imageWrap}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'}
          alt={product.name}
          className={CSS.image}
          loading="lazy"
        />
      </div>

      <div className={CSS.content}>
        <h3 className={CSS.title}>{product.name}</h3>

        <div className={CSS.ratingRow}>
          <span className="flex items-center">{renderStars(rating)}</span>
          <span className={CSS.ratingCount}>{reviews.toLocaleString()}</span>
        </div>

        <p className={CSS.price}>
          <span className={CSS.dollarSign}>$</span>
          {price.toFixed(2)}
        </p>

        <p className={CSS.delivery}>FREE delivery</p>
        <p className={CSS.category}>Category: {product.category}</p>

        {product.sourcePlatform ? <p className={CSS.seller}>Sold by {product.sourcePlatform}</p> : null}

        {product.sourceUrl ? (
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className={CSS.sourceLink}
          >
            Visit source
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => dispatch(addToCart({ productId: product.id, quantity: 1 }))}
          className={CSS.addButton}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
