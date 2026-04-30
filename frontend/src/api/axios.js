import axios from "axios";

/* =========================
   BASE CONFIG
========================= */
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ujc_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "";

    const currentPath = window.location.pathname;

    /* =========================
       UNAUTHORIZED (401)
    ========================= */
    if (status === 401) {
      localStorage.removeItem("ujc_token");
      localStorage.removeItem("ujc_user");

      if (currentPath !== "/login") {
        window.location.href = "/login";
      }
    }

    /* =========================
       PLAN EXPIRED / UPGRADE REQUIRED
    ========================= */
    if (
      status === 403 &&
      (
        message.toLowerCase().includes("expired") ||
        message.toLowerCase().includes("upgrade")
      )
    ) {
      // Prevent multiple alerts loop
      if (currentPath !== "/upgrade") {
        alert(
          message ||
          "Your plan has expired. Please upgrade to continue."
        );

        window.location.href = "/upgrade";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
