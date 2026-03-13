import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../features/cart/cartSlice';
import { requestJson, withAuth } from '../lib/api';

function Checkout() {
  const dispatch = useDispatch();
  const { items, subtotal } = useSelector((state) => state.cart);
  const { accessToken, user } = useSelector((state) => state.auth);

  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('0700000000');
  const [customerName, setCustomerName] = useState(user?.full_name || 'Dicalo Customer');
  const [email, setEmail] = useState(user?.email || '');

  const shipping = useMemo(() => (subtotal > 150 ? 0 : 8), [subtotal]);
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = subtotal + shipping + tax;

  const submitPayment = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      setError('Please sign in before checkout.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const order = await requestJson('/orders', {
        method: 'POST',
        headers: withAuth(accessToken)
      });

      const payment = await requestJson(`/orders/${order.id}/pay/ecobank/checkout`, {
        method: 'POST',
        headers: withAuth(accessToken, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          phone_number: phoneNumber,
          customer_name: customerName,
          email,
          currency: 'KES',
          return_url: `${window.location.origin}/checkout`
        })
      });

      dispatch(fetchCart());
      setComplete(true);

      if (payment.checkout_url) {
        window.open(payment.checkout_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (complete) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm shadow-emerald-100">
          <h2 className="text-2xl font-semibold text-emerald-900">Checkout Initialized</h2>
          <p className="mt-2 text-emerald-800">
            Your order was created successfully. Continue payment in the Ecobank checkout window (if provided).
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <form className="glass-panel p-6" onSubmit={submitPayment}>
        <h2 className="text-xl font-semibold text-slate-900">Secure Checkout</h2>
        <p className="mt-1 text-sm text-slate-600">This checkout creates an order and initiates Ecobank payment.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Full Name
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field mt-1"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Phone Number
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="07XXXXXXXX"
              className="input-field mt-1"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          disabled={processing || items.length === 0}
          className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
        >
          {processing ? 'Processing...' : 'Checkout with Ecobank'}
        </button>
      </form>

      <aside className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p className="flex justify-between"><span>Items</span><span>${subtotal.toFixed(2)}</span></p>
          <p className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></p>
          <p className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></p>
          <hr className="my-2 border-white/60" />
          <p className="flex justify-between text-base font-bold text-slate-900"><span>Total</span><span>${total.toFixed(2)}</span></p>
        </div>
      </aside>
    </section>
  );
}

export default Checkout;
