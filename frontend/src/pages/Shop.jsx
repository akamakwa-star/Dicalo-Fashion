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
    <section className="min-h-screen bg-slate-100 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-md border border-slate-300 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search Amazon style products"
              className="rounded-md border border-slate-400 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="rounded-md border border-slate-400 px-3 py-2 text-sm outline-none focus:border-amber-500"
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
              className="rounded-md border border-slate-400 px-3 py-2 text-sm outline-none focus:border-amber-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="mt-4 border-b border-slate-300 pb-2">
          <p className="text-sm text-slate-700">
            {filtered.length > 0 ? `1-${filtered.length}` : '0-0'} of {filtered.length} results
          </p>
        </div>

        {backendStatus === 'offline' && backendNotice ? (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {backendNotice}
          </div>
        ) : null}

        {status === 'loading' ? <p className="mt-6 text-slate-700">Loading products...</p> : null}
        {status === 'failed' ? <p className="mt-6 text-red-600">{error}</p> : null}
        {status === 'succeeded' && filtered.length === 0 ? (
          <p className="mt-6 text-slate-700">No products to display yet. Waiting for backend products.</p>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Shop;
