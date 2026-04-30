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

  /* 🔥 FILTER */
  const [filter, setFilter] = useState("all");

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* 🔊 SOUND */
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

  /* =========================
     LOAD NOTIFICATIONS
  ========================= */
  const loadNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread/count"),
      ]);

      const newCount = countRes.data.count || 0;

      /* 🔊 SOUND ALERT */
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

  /* =========================
     AUTO REFRESH (2s)
  ========================= */
  useEffect(() => {
    if (!isAuthenticated) return;

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /* =========================
     MARK READ
  ========================= */
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch {}
  };

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">

      {/* 🔊 SOUND FILE */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img src={logo} alt="Ughelli Job Connect" className="h-12" />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex gap-5 items-center">

          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Jobs</NavLink>

          {/* 🔔 NOTIFICATIONS */}
          {isAuthenticated && (
            <div className="relative">

              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-xl"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white border rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">

                  {/* HEADER */}
                  <div className="p-3 border-b font-semibold flex justify-between items-center">
                    Notifications

                    {/* FILTER */}
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="all">All</option>
                      <option value="payment">Payments</option>
                      <option value="job">Jobs</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  {filteredNotifications.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}

                  {filteredNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        !n.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-semibold text-sm">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {n.message}
                      </p>
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

        {/* Mobile Toggle */}
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

