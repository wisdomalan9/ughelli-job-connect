import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

function SeekerDashboard() {
  const { user, refreshUser } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      await refreshUser();

      const res = await api.get("/applications/my/list");
      setApplications(res.data.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const badgeColor = (status) => {
    switch (status) {
      case "hired":
        return "bg-green-100 text-green-700";
      case "shortlisted":
        return "bg-blue-100 text-blue-700";
      case "interview":
        return "bg-purple-100 text-purple-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const strength = user?.profileStrength || 20;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.fullName}
        </h1>

        <p className="text-gray-500 mt-2">
          Build a strong profile to get hired faster.
        </p>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Free Applications Left
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {user?.freeApplicationsLeft}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Plan
            </p>
            <p className="text-2xl font-bold text-green-700 capitalize">
              {user?.premiumPlan}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Applications
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {applications.length}
            </p>
          </div>
        </div>

        {/* Profile Strength */}
        <div className="mt-8">
          <div className="flex justify-between text-sm font-semibold">
            <span>Profile Strength</span>
            <span>{strength}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${strength}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Complete your profile to unlock verification badge.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-5 border">
          <h2 className="text-xl font-bold">
            My Professional Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">

            <p><strong>Location:</strong> {user?.location || "Not added"}</p>
            <p><strong>Skills:</strong> {user?.skills || "Not added"}</p>
            <p><strong>Experience:</strong> {user?.experience || "Not added"}</p>
            <p><strong>Education:</strong> {user?.education || "Not added"}</p>
            <p><strong>Expected Salary:</strong> {user?.expectedSalary || "Not added"}</p>
            <p><strong>Availability:</strong> {user?.availability || "Not added"}</p>

          </div>

          <div className="mt-4 flex flex-wrap gap-3">

            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>

            <button className="bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-yellow-600">
              Upgrade Premium
            </button>

            {user?.isVerified && (
              <span className="px-4 py-3 rounded-lg bg-blue-100 text-blue-700 font-semibold">
                🔵 Verified
              </span>
            )}

            {user?.eliteVerified && (
              <span className="px-4 py-3 rounded-lg bg-purple-100 text-purple-700 font-semibold">
                ⭐ Trusted Elite
              </span>
            )}

          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="bg-orange-500 text-white px-5 py-3 rounded-lg hover:bg-orange-600"
          >
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Applications */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          My Applications
        </h2>

        {loading && (
          <div className="py-10 text-center font-semibold">
            Loading...
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="bg-white mt-5 rounded-2xl shadow border p-8 text-center">
            <p className="text-gray-600">
              No applications yet.
            </p>

            <Link
              to="/jobs"
              className="inline-block mt-4 text-blue-600 font-semibold"
            >
              Find Jobs
            </Link>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="grid gap-5 mt-5">
            {applications.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow border p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h3 className="text-xl font-bold">
                      {item.jobId?.title}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      {item.jobId?.company}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.jobId?.location}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.interviewDate && (
                  <div className="mt-4 text-sm text-purple-700">
                    Interview:{" "}
                    {new Date(item.interviewDate).toLocaleDateString()}
                    {" • "}
                    {item.interviewLocation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SeekerDashboard;
