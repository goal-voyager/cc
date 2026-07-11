import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ArtisanProfile() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet(`/artisans/${id}`)
      .then(setArtisan)
      .catch(() => setError("Could not load this artisan's profile."));
    apiGet(`/products?artisan=${id}`)
      .then(setProducts)
      .catch(() => {});
  }, [id]);

  if (error) return <main className="container"><p>{error}</p></main>;
  if (!artisan) return <main className="container"><p>Loading profile...</p></main>;

  const img = artisan.photoUrl || "https://placehold.co/200x200/f0f9ff/0369a1?text=Artisan";

  return (
    <main className="container">
      <div className="profile-hero">
        <img src={img} alt={artisan.name} />
        <div className="info">
          <h2>{artisan.name}</h2>
          <p className="tag">
            {artisan.skill} - {artisan.village}, {artisan.state}
          </p>
          <p>{artisan.story}</p>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: "2rem" }}>
        Products by this Artisan
      </h2>
      <div className="grid">
        {!products && <p>Loading products...</p>}
        {products?.length === 0 && <p>This artisan has not listed any products yet.</p>}
        {products?.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </main>
  );
}
