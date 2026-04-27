import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-gray-700 hover:text-blue-700 transition";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Ughelli Job Connect"
            className="h-12 w-auto object-contain"
          />
          <div className="hidden md:block leading-tight">
            <h1 className="text-lg font-bold text-blue-900">
              Ughelli Job Connect
            </h1>
            <p className="text-xs text-green-600 font-medium">
              Empowering Careers
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">

          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink>

          {!user && (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>

              <NavLink
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </NavLink>
            </>
          )}

          {user?.role === "seeker" && (
            <>
              <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/profile" className={navClass}>Profile</NavLink>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <NavLink to="/employer" className={navClass}>Employer</NavLink>
              <NavLink to="/post-job" className={navClass}>Post Job</NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" className={navClass}>Admin</NavLink>
            </>
          )}

          {user && (
            <button
              onClick={logout}
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
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-3">

          <NavLink to="/" className={navClass}>Home</NavLink><br />
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink><br />

          {!user && (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink><br />
              <NavLink to="/register" className={navClass}>Register</NavLink><br />
            </>
          )}

          {user?.role === "seeker" && (
            <>
              <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink><br />
              <NavLink to="/profile" className={navClass}>Profile</NavLink><br />
            </>
          )}

          {user?.role === "employer" && (
            <>
              <NavLink to="/employer" className={navClass}>Employer</NavLink><br />
              <NavLink to="/post-job" className={navClass}>Post Job</NavLink><br />
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" className={navClass}>Admin</NavLink><br />
            </>
          )}

          {user && (
            <button
              onClick={logout}
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
