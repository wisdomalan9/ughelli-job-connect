import { createContext, useContext, useEffect, useState, useRef } from "react";
import api from "../api/axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const lastNotificationId = useRef(null);

  /* =========================
     LOAD NOTIFICATIONS
  ========================= */
  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");

      const data = res.data.notifications || [];

      setNotifications(data);

      const unreadCount = data.filter(n => !n.isRead).length;
      setUnread(unreadCount);

      /* =========================
         SMART SOUND LOGIC
      ========================= */
      if (data.length > 0) {
        const latest = data[0];

        if (lastNotificationId.current !== latest._id) {
          // New notification detected
          lastNotificationId.current = latest._id;

          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {});
        }
      }

    } catch (err) {
      console.log("Notification error:", err);
    }
  };

  /* =========================
     AUTO REFRESH (2s)
  ========================= */
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
