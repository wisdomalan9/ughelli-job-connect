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
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-gray-700 hover:text-blue-700";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Ughelli Job Connect"
            className="h-12 w-auto object-contain"
          />

          <div className="hidden md:block leading-tight">
            <h1 className="font-bold text-blue-900">
              Ughelli Job Connect
            </h1>

            <p className="text-xs text-gray-500">
              Empowering Careers
            </p>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex gap-5 items-center">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
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
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-blue-900"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4 pt-3 space-y-3">

          <NavLink to="/" onClick={closeMenu} className={navClass}>
            Home
          </NavLink><br />

          <NavLink to="/jobs" onClick={closeMenu} className={navClass}>
            Jobs
          </NavLink><br />

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={navClass}
              >
                Login
              </NavLink><br />

              <NavLink
                to="/register"
                onClick={closeMenu}
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Register
              </NavLink>
            </>
          )}

          {user?.role === "seeker" && (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={navClass}
              >
                Dashboard
              </NavLink><br />
            </>
          )}

          {user?.role === "employer" && (
            <>
              <NavLink
                to="/employer"
                onClick={closeMenu}
                className={navClass}
              >
                Employer
              </NavLink><br />
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={navClass}
              >
                Admin
              </NavLink><br />
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
