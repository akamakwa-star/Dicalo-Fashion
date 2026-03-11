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
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
        <p className="text-sm text-slate-500">{totalQuantity} items</p>
      </div>

      {status === 'loading' ? <p className="mb-3 text-sm text-slate-500">Loading cart...</p> : null}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => dispatch(decreaseQty({ cartItemId: item.id, currentQty: item.qty }))} className="rounded border border-slate-300 px-2 py-1">-</button>
                  <strong>{item.qty}</strong>
                  <button onClick={() => dispatch(increaseQty({ cartItemId: item.id, currentQty: item.qty }))} className="rounded border border-slate-300 px-2 py-1">+</button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => dispatch(removeFromCart({ cartItemId: item.id }))} className="text-sm text-red-600">Remove</button>
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">Subtotal</p>
              <p className="text-xl font-bold text-slate-900">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => dispatch(clearCart())} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Clear Cart</button>
              <Link to={ROUTES.CHECKOUT} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
