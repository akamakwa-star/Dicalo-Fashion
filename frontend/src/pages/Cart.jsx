import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, decreaseQty, fetchCart, increaseQty, removeFromCart } from '../features/cart/cartSlice';
import { ROUTES } from '../router/paths';

function Cart() {
  const dispatch = useDispatch();
  const { items, subtotal, totalQuantity, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Cart</p>
          <h2 className="text-2xl font-semibold text-slate-900">Your selections</h2>
        </div>
        <p className="text-sm text-slate-500">{totalQuantity} items</p>
      </div>

      {status === 'loading' ? <p className="mb-3 text-sm text-slate-500">Loading cart...</p> : null}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <div className="glass-panel p-6 text-slate-600">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="glass-panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decreaseQty({ cartItemId: item.id, currentQty: item.qty }))}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5"
                  >
                    -
                  </button>
                  <strong className="min-w-[24px] text-center">{item.qty}</strong>
                  <button
                    onClick={() => dispatch(increaseQty({ cartItemId: item.id, currentQty: item.qty }))}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => dispatch(removeFromCart({ cartItemId: item.id }))} className="text-sm text-orange-600 hover:text-orange-500">
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">Subtotal</p>
              <p className="text-xl font-semibold text-slate-900">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => dispatch(clearCart())} className="btn-outline">
                Clear Cart
              </button>
              <Link to={ROUTES.CHECKOUT} className="btn-primary">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
