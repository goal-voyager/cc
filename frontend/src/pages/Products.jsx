import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Textiles", "Pottery", "Jewellery", "Bamboo & Cane", "Food & Spices", "Home Decor", "Other"];

export default function Products() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    const timer = setTimeout(() => {
      apiGet(`/products?${params.toString()}`)
        .then(setProducts)
        .catch(() => setError("Could not load products. Is the backend running?"));
    }, 300);

    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <main className="container">
      <h2 className="section-title">Browse Products</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {error && <p>{error}</p>}
        {!products && !error && <p>Loading products...</p>}
        {products?.length === 0 && <p>No products match your filters.</p>}
        {products?.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}
