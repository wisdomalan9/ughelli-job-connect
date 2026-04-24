import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AuthModal from "./AuthModal";

function Navbar() {
  const { user, logoutUser } =
    useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const dashboardLink = user
    ? user.user.role === "employer"
      ? "/employer"
      : user.user.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <>
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Ughelli Job Connect
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>

            {user && (
              <Link to={dashboardLink}>
                Dashboard
              </Link>
            )}
          </nav>

          {!user ? (
            <button
              onClick={() => setOpen(true)}
              className="bg-orange-500 px-4 py-2 rounded-lg"
            >
              Login
            </button>
          ) : (
            <div className="flex gap-3 items-center">
              <span className="text-sm">
                {user.user.fullName}
              </span>

              <button
                onClick={logoutUser}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default Navbar;
