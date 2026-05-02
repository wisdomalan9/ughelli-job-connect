import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";

function Navbar() {
  const [open, setOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [filter, setFilter] = useState("all");

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const audioRef = useRef(null);
  const lastCountRef = useRef(0);

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

  /* ========================= NOTIFICATIONS ========================= */
  const loadNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread/count"),
      ]);

      const newCount = countRes.data.count || 0;

      if (newCount > lastCountRef.current) {
        audioRef.current?.play();
      }

      lastCountRef.current = newCount;

      setNotifications(listRes.data.notifications || []);
      setUnreadCount(newCount);
    } catch (err) {
      console.log("Notification error:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    loadNotifications();

    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /* 🔥 NEW SMART HANDLER */
  const handleNotificationClick = async (n) => {
    try {
      await api.put(`/notifications/${n._id}/read`);

      // Smart navigation
      if (n.type === "payment") {
        navigate("/admin");
      } else if (n.type === "job" && n.jobId) {
        navigate(`/jobs/${n.jobId}`);
      } else {
        navigate("/dashboard");
      }

      setNotifOpen(false);
      loadNotifications();
    } catch (err) {
      console.log("Notification click error", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-10" />
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex gap-5 items-center">

          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink>

          {/* 🔔 NOTIFICATION */}
          {isAuthenticated && (
            <div className="relative">

              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="text-xl relative"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">

                  <div className="p-3 font-bold border-b flex justify-between">
                    Notifications

                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-xs border px-2 rounded"
                    >
                      <option value="all">All</option>
                      <option value="payment">Payments</option>
                      <option value="job">Jobs</option>
                    </select>
                  </div>

                  {filteredNotifications.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">
                      No notifications
                    </div>
                  )}

                  {filteredNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 border-b cursor-pointer ${
                        !n.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-semibold text-sm">{n.title}</p>
                      <p className="text-xs text-gray-600">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">

          <NavLink to="/" onClick={closeMenu} className={navClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" onClick={closeMenu} className={navClass}>
            Jobs
          </NavLink>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full bg-blue-700 text-white py-2 rounded-lg"
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
