import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api/client";

const CATEGORIES = ["Textiles", "Pottery", "Jewellery", "Bamboo & Cane", "Food & Spices", "Home Decor", "Other"];

export default function ArtisanDashboard() {
  const [artisan, setArtisan] = useState(undefined); // undefined = loading, null = none yet
  const [products, setProducts] = useState([]);

  function refreshProducts() {
    apiGet("/products/mine").then(setProducts).catch(() => {});
  }

  useEffect(() => {
    apiGet("/artisans/me").then(setArtisan).catch(() => setArtisan(null));
  }, []);

  useEffect(() => {
    if (artisan) refreshProducts();
  }, [artisan]);

  if (artisan === undefined) return <main className="container"><p>Loading your dashboard...</p></main>;

  if (!artisan) {
    return <main className="container narrow"><ProfileForm onDone={setArtisan} /></main>;
  }

  return (
    <main className="container">
      <div className="profile-hero">
        <img src={artisan.photoUrl || "https://placehold.co/200x200/f0f9ff/0369a1?text=You"} alt={artisan.name} />
        <div className="info">
          <h2>{artisan.name}</h2>
          <p className="tag">
            {artisan.skill} - {artisan.village}, {artisan.state}
          </p>
        </div>
      </div>

      <h2 className="section-title">List a New Product</h2>
      <ProductForm onCreated={refreshProducts} />

      <h2 className="section-title" style={{ marginTop: "2rem" }}>
        My Products
      </h2>
      <div className="grid">
        {products.length === 0 && <p>You haven't listed any products yet.</p>}
        {products.map((p) => (
          <div className="card" key={p._id}>
            <img src={p.imageUrl || "https://placehold.co/300x160/f0f9ff/0369a1?text=CraftConnect"} alt={p.title} />
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="price">₹{p.price}</p>
              <button
                className="btn danger"
                onClick={async () => {
                  if (!confirm("Remove this product?")) return;
                  await apiDelete(`/products/${p._id}`);
                  refreshProducts();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function ProfileForm({ onDone }) {
  const [form, setForm] = useState({ village: "", state: "", story: "", photoUrl: "", skill: "" });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const artisan = await apiPost("/artisans", form);
      onDone(artisan);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h2 className="section-title">Complete Your Artisan Profile</h2>
      <p className="muted">This is what buyers will see - tell them about yourself and your craft.</p>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label>Craft / skill (e.g. Handloom weaving)</label>
          <input required value={form.skill} onChange={(e) => update("skill", e.target.value)} />
        </div>
        <div className="field">
          <label>Village / Town</label>
          <input required value={form.village} onChange={(e) => update("village", e.target.value)} />
        </div>
        <div className="field">
          <label>State</label>
          <input required value={form.state} onChange={(e) => update("state", e.target.value)} />
        </div>
        <div className="field">
          <label>Your story</label>
          <textarea required value={form.story} onChange={(e) => update("story", e.target.value)} />
        </div>
        <div className="field">
          <label>Photo URL (optional)</label>
          <input value={form.photoUrl} onChange={(e) => update("photoUrl", e.target.value)} placeholder="https://..." />
        </div>
        <button type="submit" className="btn">Save Profile</button>
        {error && <div className="form-msg err">{error}</div>}
      </form>
    </>
  );
}

function ProductForm({ onCreated }) {
  const empty = { title: "", description: "", price: "", category: "", imageUrl: "" };
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    try {
      await apiPost("/products", { ...form, price: Number(form.price) });
      setMsg({ type: "ok", text: "Product listed!" });
      setForm(empty);
      onCreated();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="field">
        <label>Product title</label>
        <input required value={form.title} onChange={(e) => update("title", e.target.value)} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea required value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>
      <div className="field">
        <label>Price in ₹</label>
        <input type="number" min="0" required value={form.price} onChange={(e) => update("price", e.target.value)} />
      </div>
      <div className="field">
        <label>Category</label>
        <select required value={form.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Choose a category</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Image URL (optional)</label>
        <input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." />
      </div>
      <button type="submit" className="btn">List Product</button>
      {msg && <div className={`form-msg ${msg.type}`}>{msg.text}</div>}
    </form>
  );
}
