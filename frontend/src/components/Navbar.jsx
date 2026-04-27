import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-gray-700 hover:text-blue-700";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div className="hidden md:block">
            <h1 className="font-bold text-blue-900">
              Ughelli Job Connect
            </h1>
            <p className="text-xs text-gray-500">
              Empowering Careers
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-5 items-center">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Register
              </NavLink>
            </>
          )}

          {user?.role === "seeker" && (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          )}

          {user?.role === "employer" && (
            <NavLink to="/employer" className={navClass}>
              Employer
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Navbar;
