import { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../api/client";

const TABS = ["Users", "Artisans", "Products"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Users");
  const [users, setUsers] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [products, setProducts] = useState([]);

  function loadAll() {
    apiGet("/admin/users").then(setUsers).catch(() => {});
    apiGet("/artisans").then(setArtisans).catch(() => {});
    apiGet("/products").then(setProducts).catch(() => {});
  }

  useEffect(loadAll, []);

  async function removeUser(id) {
    if (!confirm("Delete this account?")) return;
    await apiDelete(`/admin/users/${id}`);
    loadAll();
  }
  async function removeArtisan(id) {
    if (!confirm("Delete this artisan profile? Their products will remain listed.")) return;
    await apiDelete(`/artisans/${id}`);
    loadAll();
  }
  async function removeProduct(id) {
    if (!confirm("Delete this product?")) return;
    await apiDelete(`/products/${id}`);
    loadAll();
  }

  return (
    <main className="container">
      <h2 className="section-title">Admin Dashboard</h2>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t} ({t === "Users" ? users.length : t === "Artisans" ? artisans.length : products.length})
          </button>
        ))}
      </div>

      {tab === "Users" && (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== "admin" && (
                    <button className="link-btn danger" onClick={() => removeUser(u._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "Artisans" && (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Skill</th><th>Location</th><th></th></tr>
          </thead>
          <tbody>
            {artisans.map((a) => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.skill}</td>
                <td>{a.village}, {a.state}</td>
                <td>
                  <button className="link-btn danger" onClick={() => removeArtisan(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "Products" && (
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Price</th><th>Artisan</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.artisan?.name || "Unknown"}</td>
                <td>
                  <button className="link-btn danger" onClick={() => removeProduct(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
