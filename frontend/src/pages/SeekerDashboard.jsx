import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";
import {
  useAuth,
} from "../context/AuthContext.jsx";

function SeekerDashboard() {
  const {
    user,
    refreshUser,
  } = useAuth();

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadData =
    async () => {
      try {
        setLoading(true);

        await refreshUser();

        const res =
          await api.get(
            "/applications/my/list"
          );

        setApplications(
          res.data
            .applications ||
            []
        );
      } catch {
        setApplications(
          []
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const badgeColor = (
    status
  ) => {
    switch (
      status
    ) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-3xl font-bold">
          Welcome,{" "}
          {user?.fullName}
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Free Applications Left
            </p>

            <p className="text-2xl font-bold text-blue-700">
              {
                user?.freeApplicationsLeft
              }
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Plan
            </p>

            <p className="text-2xl font-bold text-green-700 capitalize">
              {
                user?.premiumPlan
              }
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Applications
            </p>

            <p className="text-2xl font-bold text-purple-700">
              {
                applications.length
              }
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Jobs
          </Link>

          <button
            className="bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-yellow-600"
          >
            Upgrade Premium
          </button>
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

        {!loading &&
          applications.length ===
            0 && (
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

        {!loading &&
          applications.length >
            0 && (
            <div className="grid gap-5 mt-5">
              {applications.map(
                (item) => (
                  <div
                    key={
                      item._id
                    }
                    className="bg-white rounded-2xl shadow border p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            item
                              .jobId
                              ?.title
                          }
                        </h3>

                        <p className="text-gray-600 mt-1">
                          {
                            item
                              .jobId
                              ?.company
                          }
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            item
                              .jobId
                              ?.location
                          }
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
                          item.status
                        )}`}
                      >
                        {
                          item.status
                        }
                      </span>
                    </div>

                    {item.interviewDate && (
                      <div className="mt-4 text-sm text-purple-700">
                        Interview:{" "}
                        {new Date(
                          item.interviewDate
                        ).toLocaleDateString()}
                        {" • "}
                        {
                          item.interviewLocation
                        }
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default SeekerDashboard;
