import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext.jsx";

function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();

  const [role, setRole] =
    useState("seeker");

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const goByRole = (
    user
  ) => {
    if (
      user.role ===
      "employer"
    ) {
      navigate(
        "/employer"
      );
    } else {
      navigate(
        "/dashboard"
      );
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        setError("");

        const payload = {
          role,
          fullName,
          businessName:
            role ===
            "employer"
              ? businessName
              : "",
          email,
          phone,
          password,
        };

        const user =
          await register(
            payload
          );

        goByRole(user);
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Registration failed."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow border p-8">
        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Join Ughelli Job Connect
        </p>

        {error && (
          <div className="mt-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6 space-y-5"
        >
          {/* Role */}
          <div>
            <label className="block mb-2 font-medium">
              I am a:
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="seeker">
                Job Seeker
              </option>

              <option value="employer">
                Employer
              </option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              required
              value={
                fullName
              }
              onChange={(e) =>
                setFullName(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Business */}
          {role ===
            "employer" && (
            <div>
              <label className="block mb-2 font-medium">
                Business Name
              </label>

              <input
                type="text"
                required
                value={
                  businessName
                }
                onChange={(
                  e
                ) =>
                  setBusinessName(
                    e
                      .target
                      .value
                  )
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              type="text"
              required
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              required
              minLength="6"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
