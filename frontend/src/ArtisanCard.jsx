import { Link } from "react-router-dom";

export default function ArtisanCard({ artisan }) {
  const img = artisan.photoUrl || "https://placehold.co/300x160/f0f9ff/0369a1?text=Artisan";
  return (
    <div className="card">
      <img src={img} alt={artisan.name} />
      <div className="card-body">
        <h3>{artisan.name}</h3>
        <p className="meta">
          {artisan.skill} - {artisan.village}, {artisan.state}
        </p>
        <Link className="btn" to={`/artisans/${artisan._id}`}>
          View Profile
        </Link>
      </div>
    </div>
  );
}
