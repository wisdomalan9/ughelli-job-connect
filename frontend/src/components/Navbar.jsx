import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { user, isAuthenticated, logout } =
    useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink = () => {
    if (!user) return "/login";

    if (user.role === "admin")
      return "/admin";

    if (user.role === "employer")
      return "/employer";

    return "/dashboard";
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-700"
        >
          Ughelli Job Connect
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink
            to="/jobs"
            className={navClass}
          >
            Jobs
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={navClass}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to={dashboardLink()}
                className={navClass}
              >
                Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile button */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <NavLink
            to="/"
            className={navClass}
          >
            Home
          </NavLink>

          <br />

          <NavLink
            to="/jobs"
            className={navClass}
          >
            Jobs
          </NavLink>

          <br />

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={navClass}
              >
                Login
              </NavLink>

              <br />

              <NavLink
                to="/register"
                className={navClass}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={dashboardLink()}
                className={navClass}
              >
                Dashboard
              </NavLink>

              <br />

              <button
                onClick={
                  handleLogout
                }
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
