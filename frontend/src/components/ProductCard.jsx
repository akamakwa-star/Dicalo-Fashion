import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

const CSS = {
  card: 'flex h-full flex-col border border-slate-200 bg-white p-3 text-slate-900 transition hover:border-amber-400 hover:shadow-sm',
  imageWrap: 'flex h-52 items-center justify-center bg-white p-2',
  image: 'h-full w-full object-contain',
  content: 'mt-3 flex flex-1 flex-col',
  title: 'line-clamp-2 text-[15px] leading-5 text-slate-900',
  ratingRow: 'mt-2 flex items-center gap-2 text-sm leading-none',
  ratingCount: 'text-sky-700',
  price: 'mt-2 text-2xl leading-none text-slate-900',
  dollarSign: 'align-top text-sm',
  delivery: 'mt-1 text-xs text-emerald-700',
  category: 'mt-1 text-xs text-slate-600',
  seller: 'mt-1 text-xs text-slate-500',
  sourceLink: 'mt-1 text-xs text-sky-700 hover:underline',
  addButton: 'mt-3 w-full rounded-full border border-amber-400 bg-amber-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-400'
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

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const price = Number(product.price || 0);
  const rating = Number(product.rating || 4);
  const reviews = Number(product.reviews || Math.floor(rating * 42));

  return (
    <article className={CSS.card}>
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
