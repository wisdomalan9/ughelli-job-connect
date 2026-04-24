import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem(
        "ujc_token"
      ) || ""
    );

  const [loading, setLoading] =
    useState(true);

  /* =========================
     LOAD SAVED USER
  ========================= */
  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        "ujc_user"
      );

    if (savedUser) {
      try {
        setUser(
          JSON.parse(savedUser)
        );
      } catch {
        localStorage.removeItem(
          "ujc_user"
        );
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (
    email,
    password
  ) => {
    const res =
      await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    const data = res.data;

    localStorage.setItem(
      "ujc_token",
      data.token
    );

    localStorage.setItem(
      "ujc_user",
      JSON.stringify(
        data.user
      )
    );

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  /* =========================
     REGISTER
  ========================= */
  const register =
    async (payload) => {
      const res =
        await api.post(
          "/auth/register",
          payload
        );

      const data = res.data;

      localStorage.setItem(
        "ujc_token",
        data.token
      );

      localStorage.setItem(
        "ujc_user",
        JSON.stringify(
          data.user
        )
      );

      setToken(data.token);
      setUser(data.user);

      return data.user;
    };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem(
      "ujc_token"
    );

    localStorage.removeItem(
      "ujc_user"
    );

    setToken("");
    setUser(null);
  };

  /* =========================
     REFRESH PROFILE
  ========================= */
  const refreshUser =
    async () => {
      try {
        const res =
          await api.get(
            "/auth/me"
          );

        setUser(
          res.data.user
        );

        localStorage.setItem(
          "ujc_user",
          JSON.stringify(
            res.data.user
          )
        );
      } catch {
        logout();
      }
    };

  const value = {
    user,
    token,
    loading,
    isAuthenticated:
      !!user &&
      !!token,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () =>
    useContext(
      AuthContext
    );
