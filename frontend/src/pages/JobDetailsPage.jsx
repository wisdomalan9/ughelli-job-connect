import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

function JobDetailsPage() {
  const { id } =
    useParams();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [applying, setApplying] =
    useState(false);

  const loadJob =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            `/jobs/${id}`
          );

        setJob(
          res.data.job
        );
      } catch {
        setError(
          "Job not found."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleApply =
    async () => {
      try {
        setApplying(true);
        setError("");
        setMessage("");

        await api.post(
          `/applications/apply/${id}`,
          {
            applicationLetter:
              "I am interested in this opportunity.",
          }
        );

        setMessage(
          "Application submitted successfully."
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to apply."
        );
      } finally {
        setApplying(false);
      }
    };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-lg font-semibold">
        Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">
          Job Not Found
        </h2>

        <Link
          to="/jobs"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Back To Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow border p-8">
        <h1 className="text-3xl font-bold">
          {job.title}
        </h1>

        <p className="mt-3 text-lg font-medium text-gray-700">
          {job.company}
        </p>

        <div className="mt-4 space-y-2 text-gray-600">
          <p>
            📍 {job.location}
          </p>

          <p>
            💰 {job.salary}
          </p>

          <p>
            📁 {job.category}
          </p>

          <p>
            ⏰ {job.jobType}
          </p>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-bold">
          Description
        </h2>

        <p className="mt-3 text-gray-700 leading-8">
          {job.description}
        </p>

        {job.requirements && (
          <>
            <h2 className="text-xl font-bold mt-8">
              Requirements
            </h2>

            <p className="mt-3 text-gray-700 leading-8">
              {
                job.requirements
              }
            </p>
          </>
        )}

        {/* Alerts */}
        {message && (
          <div className="mt-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Apply */}
        <div className="mt-8">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Login To Apply
            </Link>
          ) : user?.role !==
            "seeker" ? (
            <div className="text-sm text-gray-600">
              Only job seekers can apply.
            </div>
          ) : (
            <button
              onClick={
                handleApply
              }
              disabled={
                applying
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {applying
                ? "Applying..."
                : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
