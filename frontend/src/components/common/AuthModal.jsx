import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function AuthModal({ isOpen, onClose }) {
  const { loginUser } = useContext(AuthContext);

  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("seeker");

  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    try {
      setLoading(true);

      const url =
        tab === "login"
          ? "http://localhost:5000/api/v1/auth/login"
          : "http://localhost:5000/api/v1/auth/register";

      const payload =
        tab === "login"
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              ...form,
              role,
            };

      const res = await axios.post(url, payload);

      loginUser(res.data);
      onClose();
      alert(res.data.message);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Top */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {tab === "login"
              ? "Login"
              : "Create Account"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setTab("login")}
            className={`px-4 py-2 rounded-lg ${
              tab === "login"
                ? "bg-blue-900 text-white"
                : "bg-slate-100"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("register")}
            className={`px-4 py-2 rounded-lg ${
              tab === "register"
                ? "bg-orange-500 text-white"
                : "bg-slate-100"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="mt-5 space-y-4">
          {tab === "register" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <select
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full border px-4 py-3 rounded-lg"
              >
                <option value="seeker">
                  Job Seeker
                </option>
                <option value="employer">
                  Employer
                </option>
              </select>

              {role === "employer" && (
                <input
                  name="businessName"
                  placeholder="Business Name"
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
                />
              )}
            </>
          )}

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Please wait..."
              : tab === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
