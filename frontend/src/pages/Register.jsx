import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselectedRole = params.get("role") === "artisan" ? "artisan" : "user";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(preselectedRole);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await register(name, email, password, role);
      navigate(user.role === "artisan" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container narrow">
      <h2 className="section-title">Create Your Account</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password (min 6 characters)</label>
          <input
            id="password"
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="role">I am a...</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Buyer</option>
            <option value="artisan">Artisan / SHG member (I want to sell)</option>
          </select>
        </div>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Creating account..." : "Sign Up"}
        </button>
        {error && <div className="form-msg err">{error}</div>}
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
