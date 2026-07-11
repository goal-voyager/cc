import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const img = product.imageUrl || "https://placehold.co/300x160/f0f9ff/0369a1?text=CraftConnect";
  return (
    <div className="card">
      <img src={img} alt={product.title} />
      <div className="card-body">
        <h3>{product.title}</h3>
        <p className="meta">by {product.artisan?.name || "Unknown artisan"}</p>
        <p className="price">₹{product.price}</p>
        <Link className="btn" to={`/products/${product._id}`}>
          View Product
        </Link>
      </div>
    </div>
  );
}
