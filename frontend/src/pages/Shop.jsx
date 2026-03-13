import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { fetchProducts, setCategory, setQuery, setSortBy } from '../features/products/productSlice';

function Shop() {
  const dispatch = useDispatch();
  const { items, status, error, backendStatus, backendNotice, query, category, sortBy } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    let data = items.filter((product) => {
      const textMatch = !text || product.name.toLowerCase().includes(text);
      const categoryMatch = category === 'all' || product.category === category;
      return textMatch && categoryMatch;
    });

    if (sortBy === 'price-asc') data = [...data].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') data = [...data].sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') data = [...data].sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }, [items, query, category, sortBy]);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-3 animate-fade-up">
          <span className="chip">Curated marketplace</span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Shop the edit</h1>
          <p className="max-w-2xl text-slate-600">
            Filter by category, browse by price, and discover the latest items pulled from connected marketplaces.
          </p>
        </div>

        <div className="glass-panel p-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="grid gap-3 md:grid-cols-[1.1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search curated pieces"
              className="input-field"
            />
            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="select-field"
            >
              <option value="all">All departments</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="accessories">Accessories</option>
              <option value="footwear">Footwear</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="select-field"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/60 pb-2 text-sm text-slate-600">
          <p>
            {filtered.length > 0 ? `1-${filtered.length}` : '0-0'} of {filtered.length} results
          </p>
          <p>Updated daily with new arrivals.</p>
        </div>

        {backendStatus === 'offline' && backendNotice ? (
          <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            {backendNotice}
          </div>
        ) : null}

        {status === 'loading' ? <p className="mt-6 text-slate-700">Loading products...</p> : null}
        {status === 'failed' ? <p className="mt-6 text-red-600">{error}</p> : null}
        {status === 'succeeded' && filtered.length === 0 ? (
          <p className="mt-6 text-slate-700">No products to display yet. Waiting for backend products.</p>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Shop;
