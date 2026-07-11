import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import ProductCard from "../components/ProductCard";
import ArtisanCard from "../components/ArtisanCard";

export default function Home() {
  const [products, setProducts] = useState(null);
  const [artisans, setArtisans] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/products").then(setProducts).catch(() => setError("products"));
    apiGet("/artisans").then(setArtisans).catch(() => setError("artisans"));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Handmade with heart, sold with dignity</h1>
          <p>
            CraftConnect helps homemakers and Self-Help Group members sell their handmade
            products directly - no commission, no middlemen, full earnings to the seller.
          </p>
          <Link to="/products" className="btn">
            Browse Products
          </Link>
          <Link to="/register?role=artisan" className="btn secondary">
            Join as an Artisan
          </Link>
        </div>
      </section>

      <main className="container">
        <h2 className="section-title">Latest Products</h2>
        <div className="grid">
          {!products && !error && <p>Loading products...</p>}
          {error && <p>Could not load products. Is the backend running?</p>}
          {products?.length === 0 && <p>No products listed yet.</p>}
          {products?.slice(0, 6).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: "2.5rem" }}>
          Meet Our Artisans
        </h2>
        <div className="grid">
          {!artisans && !error && <p>Loading artisans...</p>}
          {artisans?.length === 0 && <p>No artisans registered yet.</p>}
          {artisans?.slice(0, 6).map((a) => (
            <ArtisanCard key={a._id} artisan={a} />
          ))}
        </div>
      </main>
    </>
  );
}
