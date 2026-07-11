import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiGet, apiDelete } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet(`/products/${id}`)
      .then(setProduct)
      .catch(() => setError("Could not load this product. It may have been removed."));
  }, [id]);

  async function handleDelete() {
    if (!confirm("Remove this product?")) return;
    try {
      await apiDelete(`/products/${id}`);
      navigate("/products");
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) return <main className="container"><p>{error}</p></main>;
  if (!product) return <main className="container"><p>Loading product...</p></main>;

  const img = product.imageUrl || "https://placehold.co/600x360/f0f9ff/0369a1?text=CraftConnect";
  const artisan = product.artisan || {};
  const canDelete =
    user && (user.role === "admin" || (user.role === "artisan" && artisan.user === user.id));

  return (
    <main className="container">
      <div className="card detail-card">
        <img src={img} alt={product.title} />
        <div className="card-body">
          <h2>{product.title}</h2>
          <p className="price" style={{ fontSize: "1.3rem" }}>₹{product.price}</p>
          <p>{product.description}</p>
          <p className="meta">Category: {product.category}</p>
          <p className="meta">
            Sold by <Link to={`/artisans/${artisan._id}`}>{artisan.name || "Unknown"}</Link> from{" "}
            {artisan.village}, {artisan.state}
          </p>
          {canDelete && (
            <button className="btn danger" onClick={handleDelete}>
              Delete Product
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
