import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    certificates: "",
    cvFile: "",
    expectedSalary: "",
    availability: "",
    linkedin: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        bio: user.bio || "",
        location: user.location || "",
        skills: user.skills || "",
        experience: user.experience || "",
        education: user.education || "",
        certificates: user.certificates || "",
        cvFile: user.cvFile || "",
        expectedSalary: user.expectedSalary || "",
        availability: user.availability || "",
        linkedin: user.linkedin || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      await api.put("/auth/update-profile", form);

      await refreshUser();

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-3xl font-bold">
          Edit Professional Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Complete your profile to attract employers.
        </p>

        {message && (
          <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 mt-6"
        >
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="expectedSalary"
            value={form.expectedSalary}
            onChange={handleChange}
            placeholder="Expected Salary"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="availability"
            value={form.availability}
            onChange={handleChange}
            placeholder="Availability"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <input
            name="cvFile"
            value={form.cvFile}
            onChange={handleChange}
            placeholder="CV Link"
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <input
            name="certificates"
            value={form.certificates}
            onChange={handleChange}
            placeholder="Certificates"
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="5"
            placeholder="Professional Bio"
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 md:col-span-2"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
