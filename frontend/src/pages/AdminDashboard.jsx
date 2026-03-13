import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { createProduct, deleteProduct, fetchProducts, resetAdminError, updateProduct } from '../features/products/productSlice';

const DEFAULT_FORM = {
  name: '',
  category: 'accessories',
  price: '',
  stock: '0',
  description: '',
  sourcePlatform: '',
  sourceUrl: '',
  image: ''
};

const CSS = {
  page: 'mx-auto max-w-7xl px-4 py-10',
  pageTitle: 'text-2xl font-semibold text-slate-900',
  pageSubtitle: 'mt-2 text-slate-600',
  statsGrid: 'mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
  chartGrid: 'mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2',
  sectionGrid: 'mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]',
  card: 'glass-panel p-5',
  cardTitle: 'text-lg font-semibold text-slate-900',
  cardTitleWithMargin: 'mb-3 text-lg font-semibold text-slate-900',
  chartWrap: 'h-72 w-full',
  form: 'mt-3 space-y-2',
  label: 'block text-sm font-semibold text-slate-700',
  input: 'input-field mt-1',
  inputCompact: 'input-field mt-1 px-3 py-2 text-sm',
  checkboxRow: 'flex items-center gap-2 text-sm text-slate-700',
  error: 'text-sm text-red-600',
  buttonPrimary: 'btn-primary disabled:cursor-not-allowed disabled:opacity-60',
  buttonSecondary: 'btn-outline',
  buttonUtility: 'btn-outline',
  buttonRow: 'flex gap-2',
  splitTwo: 'grid grid-cols-2 gap-2',
  splitThree: 'grid grid-cols-3 gap-2',
  tableWrap: 'mt-3 overflow-x-auto',
  table: 'min-w-full text-sm',
  tableHeadRow: 'border-b border-white/70 text-left text-slate-500',
  tableBodyRow: 'border-b border-white/60 transition hover:bg-white/60',
  actionButtons: 'flex gap-2',
  actionEdit: 'rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700',
  actionDelete: 'rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 disabled:cursor-not-allowed disabled:opacity-50'
};

function detectPlatform(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('amazon')) return 'Amazon';
    if (host.includes('alibaba')) return 'Alibaba';
    if (host.includes('ebay')) return 'eBay';
    if (host.includes('etsy')) return 'Etsy';
    if (host.includes('walmart')) return 'Walmart';
    if (host.includes('jumia')) return 'Jumia';
    if (host.includes('shein')) return 'SHEIN';
    return host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function titleFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const slug = pathname.split('/').filter(Boolean).pop() || '';
    return slug
      .replace(/[-_]+/g, ' ')
      .replace(/[0-9]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return '';
  }
}

function StatCard({ label, value }) {
  return (
    <article className={CSS.card}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const { items, status, backendStatus, backendNotice, adminStatus, adminError } = useSelector((state) => state.products);
  const adminReadOnly = backendStatus !== 'online';

  const [form, setForm] = useState({
    ...DEFAULT_FORM
  });
  const [editingId, setEditingId] = useState('');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  const salesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const base = items.reduce((sum, item) => sum + Number(item.price || 0), 0) || 500;
    return months.map((month, i) => ({
      month,
      sales: Math.round(base * (0.6 + i * 0.1)),
      orders: Math.round((base / 20) * (0.6 + i * 0.1))
    }));
  }, [items]);

  const topProducts = useMemo(
    () =>
      [...items]
        .sort((a, b) => Number(b.reviews || 0) - Number(a.reviews || 0))
        .slice(0, 6)
        .map((item) => ({ name: item.name, sold: Number(item.reviews || 0) })),
    [items]
  );

  const submit = async (event) => {
    event.preventDefault();
    if (adminReadOnly) return;
    dispatch(resetAdminError());

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      sourcePlatform: form.sourcePlatform.trim(),
      sourceUrl: form.sourceUrl.trim(),
      image_url: form.image.trim()
    };

    if (editingId) {
      const resultAction = await dispatch(updateProduct({ id: editingId, data: payload }));
      if (updateProduct.fulfilled.match(resultAction)) {
        setEditingId('');
        setForm({ ...DEFAULT_FORM });
      }
    } else {
      const resultAction = await dispatch(createProduct({ data: payload }));
      if (createProduct.fulfilled.match(resultAction)) {
        setForm({ ...DEFAULT_FORM });
      }
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      stock: String(item.stock || 0),
      description: item.description || '',
      sourcePlatform: item.sourcePlatform || '',
      sourceUrl: item.sourceUrl || '',
      image: item.image || ''
    });
  };

  const importFromUrl = () => {
    const sourceUrl = form.sourceUrl.trim();
    if (!sourceUrl) return;
    const detected = detectPlatform(sourceUrl);
    const detectedName = titleFromUrl(sourceUrl);
    setForm((prev) => ({
      ...prev,
      sourcePlatform: prev.sourcePlatform || detected,
      name: prev.name || detectedName || prev.name
    }));
  };

  return (
    <section className={CSS.page}>
      <h2 className={CSS.pageTitle}>Admin Dashboard</h2>
      <p className={CSS.pageSubtitle}>Manage products and monitor sales analytics.</p>

      {backendStatus === 'offline' && adminReadOnly && backendNotice ? (
        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          {backendNotice} Product management is currently read-only.
        </div>
      ) : null}

      <div className={CSS.statsGrid}>
        <StatCard label="Products" value={items.length} />
        <StatCard label="Revenue (MTD)" value={`$${salesData[salesData.length - 1]?.sales || 0}`} />
        <StatCard label="Orders (MTD)" value={salesData[salesData.length - 1]?.orders || 0} />
        <StatCard label="Admin Status" value={adminStatus} />
      </div>

      <div className={CSS.chartGrid}>
        <article className={CSS.card}>
          <h3 className={CSS.cardTitleWithMargin}>Monthly Sales</h3>
          <div className={CSS.chartWrap}>
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#0f172a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={CSS.card}>
          <h3 className={CSS.cardTitleWithMargin}>Top Products (By Reviews)</h3>
          <div className={CSS.chartWrap}>
            <ResponsiveContainer>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className={CSS.sectionGrid}>
        <article className={CSS.card}>
          <h3 className={CSS.cardTitle}>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form className={CSS.form} onSubmit={submit}>
            <label className={CSS.label}>
              Name
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className={CSS.input} />
            </label>
            <label className={CSS.label}>
              Source URL
              <input
                type="url"
                placeholder="https://example.com/product/..."
                value={form.sourceUrl}
                onChange={(e) => setForm((p) => ({ ...p, sourceUrl: e.target.value }))}
                className={CSS.input}
              />
            </label>
            <div className={CSS.splitTwo}>
              <label className={CSS.label}>
                Source Platform
                <input
                  placeholder="Amazon, Alibaba, eBay..."
                  value={form.sourcePlatform}
                  onChange={(e) => setForm((p) => ({ ...p, sourcePlatform: e.target.value }))}
                  className={CSS.input}
                />
              </label>
              <label className={CSS.label}>
                Image URL
                <input
                  type="url"
                  placeholder="https://image..."
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className={CSS.input}
                />
              </label>
            </div>
            <button type="button" onClick={importFromUrl} className={CSS.buttonUtility}>
              Import Details from URL
            </button>
            <label className={CSS.label}>
              Category
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={CSS.input}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
              </select>
            </label>
            <label className={CSS.label}>
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={CSS.input}
                rows={3}
              />
            </label>
            <div className={CSS.splitTwo}>
              <label className="text-sm font-medium text-slate-700">Price
                <input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required className={CSS.inputCompact} />
              </label>
              <label className="text-sm font-medium text-slate-700">Stock
                <input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required className={CSS.inputCompact} />
              </label>
            </div>
            {adminError ? <p className={CSS.error}>{adminError}</p> : null}
            <div className={CSS.buttonRow}>
              <button className={CSS.buttonPrimary} type="submit" disabled={adminReadOnly}>
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(''); setForm({ ...DEFAULT_FORM }); }} className={CSS.buttonSecondary}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className={CSS.card}>
          <h3 className={CSS.cardTitle}>Product Management</h3>
          <div className={CSS.tableWrap}>
            <table className={CSS.table}>
              <thead>
                <tr className={CSS.tableHeadRow}>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Rating</th>
                  <th className="py-2 pr-3">Source</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={CSS.tableBodyRow}>
                    <td className="py-2 pr-3">{item.name}</td>
                    <td className="py-2 pr-3">{item.category}</td>
                    <td className="py-2 pr-3">${Number(item.price).toFixed(2)}</td>
                    <td className="py-2 pr-3">{Number(item.rating || 0).toFixed(1)}</td>
                    <td className="py-2 pr-3">{item.sourcePlatform || 'N/A'}</td>
                    <td className="py-2">
                      <div className={CSS.actionButtons}>
                        <button type="button" onClick={() => startEdit(item)} className={CSS.actionEdit}>Edit</button>
                        <button
                          type="button"
                          onClick={() => dispatch(deleteProduct({ id: item.id }))}
                          className={CSS.actionDelete}
                          disabled={adminReadOnly}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboard;
