import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import {
  useAuth,
} from "../context/AuthContext.jsx";

function EmployerDashboard() {
  const {
    user,
    refreshUser,
  } = useAuth();

  const [jobs, setJobs] =
    useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [form, setForm] =
    useState({
      title: "",
      company: "",
      category: "",
      location: "",
      salary: "",
      description: "",
    });

  const [
    posting,
    setPosting,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadData =
    async () => {
      try {
        setLoading(true);

        await refreshUser();

        const res =
          await api.get(
            "/jobs/my/list"
          );

        setJobs(
          res.data.jobs || []
        );
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setPosting(true);
        setError("");
        setMessage("");

        await api.post(
          "/jobs",
          form
        );

        setMessage(
          "Job posted successfully."
        );

        setForm({
          title: "",
          company:
            user?.businessName ||
            "",
          category: "",
          location: "",
          salary: "",
          description: "",
        });

        loadData();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to post job."
        );
      } finally {
        setPosting(false);
      }
    };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        company:
          user.businessName ||
          "",
      }));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-3xl font-bold">
          Welcome,{" "}
          {user?.businessName ||
            user?.fullName}
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Jobs Posted
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {jobs.length}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Badge
            </p>
            <p className="text-xl font-bold text-green-700">
              {
                user?.employerBadge
              }
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Verified
            </p>
            <p className="text-xl font-bold text-purple-700">
              {user?.isVerified
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Post Job */}
      <div className="mt-10 bg-white rounded-2xl shadow border p-6">
        <h2 className="text-2xl font-bold">
          Post New Job
        </h2>

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
          onSubmit={
            handleSubmit
          }
          className="grid md:grid-cols-2 gap-4 mt-6"
        >
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={
              handleChange
            }
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="company"
            placeholder="Company"
            value={
              form.company
            }
            onChange={
              handleChange
            }
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="category"
            placeholder="Category"
            value={
              form.category
            }
            onChange={
              handleChange
            }
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="location"
            placeholder="Location"
            value={
              form.location
            }
            onChange={
              handleChange
            }
            required
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="salary"
            placeholder="Salary"
            value={
              form.salary
            }
            onChange={
              handleChange
            }
            className="border rounded-lg px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            required
            rows="5"
            className="border rounded-lg px-4 py-3 md:col-span-2"
          />

          <button
            type="submit"
            disabled={
              posting
            }
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 md:col-span-2 disabled:opacity-60"
          >
            {posting
              ? "Posting..."
              : "Post Job"}
          </button>
        </form>
      </div>

      {/* My Jobs */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          My Jobs
        </h2>

        {loading && (
          <div className="py-8 text-center font-semibold">
            Loading...
          </div>
        )}

        {!loading &&
          jobs.length ===
            0 && (
            <div className="bg-white mt-5 rounded-2xl shadow border p-8 text-center text-gray-600">
              No jobs posted yet.
            </div>
          )}

        {!loading &&
          jobs.length >
            0 && (
            <div className="grid gap-5 mt-5">
              {jobs.map(
                (job) => (
                  <div
                    key={
                      job._id
                    }
                    className="bg-white rounded-2xl shadow border p-6"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            job.title
                          }
                        </h3>

                        <p className="text-gray-600 mt-1">
                          {
                            job.location
                          }
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {
                            job.salary
                          }
                        </p>
                      </div>

                      <div className="text-sm font-semibold text-blue-700">
                        Applicants:{" "}
                        {
                          job.applicantsCount
                        }
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
