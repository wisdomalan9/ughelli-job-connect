import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">
            Ughelli Job Connect
          </h2>

          <p className="mt-3 text-sm text-gray-400 leading-6">
            Connecting job seekers with trusted
            employers across Ughelli and beyond.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">
            Quick Links
          </h3>

          <div className="space-y-2 text-sm">
            <Link
              to="/"
              className="block hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className="block hover:text-white"
            >
              Jobs
            </Link>

            <Link
              to="/login"
              className="block hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="block hover:text-white"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-3">
            Contact
          </h3>

          <div className="space-y-2 text-sm text-gray-400">
            <p>Email: ughellijobconnect@gmail.com</p>
            <p>Phone: 09167404311</p>
            <p>Ughelli, Delta State, Nigeria</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500 px-4">
        © {new Date().getFullYear()} Ughelli Job Connect.
        All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
