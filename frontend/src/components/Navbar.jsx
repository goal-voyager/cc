import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="nav-wrap container">
        <Link to="/" className="brand">
          <span className="thread">●</span> CraftConnect
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Browse Products</Link>

          {!user && <Link to="/register?role=artisan">Become an Artisan</Link>}
          {user?.role === "artisan" && <Link to="/dashboard">My Dashboard</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}

          {!user && <Link to="/login">Login</Link>}
          {!user && (
            <Link to="/register" className="btn-nav">
              Sign Up
            </Link>
          )}
          {user && (
            <span className="user-pill">
              Hi, {user.name.split(" ")[0]}
              <button onClick={handleLogout} className="link-btn">
                Logout
              </button>
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
