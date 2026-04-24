import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function JobsPage() {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const loadJobs =
    async (keyword = "") => {
      try {
        setLoading(true);

        const url = keyword
          ? `/jobs?search=${encodeURIComponent(
              keyword
            )}`
          : "/jobs";

        const res =
          await api.get(url);

        setJobs(
          res.data.jobs || []
        );
      } catch (error) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = (
    e
  ) => {
    e.preventDefault();
    loadJobs(search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Available Jobs
        </h1>

        <p className="text-gray-600 mt-2">
          Discover opportunities near you.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={
          handleSearch
        }
        className="flex flex-col md:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 border rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-lg font-semibold">
          Loading jobs...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        jobs.length ===
          0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold">
              No Jobs Found
            </h2>

            <p className="mt-3 text-gray-600">
              Try another keyword.
            </p>
          </div>
        )}

      {/* Jobs */}
      {!loading &&
        jobs.length >
          0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(
              (job) => (
                <div
                  key={
                    job._id
                  }
                  className="bg-white rounded-2xl shadow p-6 border"
                >
                  <h2 className="text-xl font-bold">
                    {
                      job.title
                    }
                  </h2>

                  <p className="mt-2 text-gray-700 font-medium">
                    {
                      job.company
                    }
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    📍{" "}
                    {
                      job.location
                    }
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    💰{" "}
                    {
                      job.salary
                    }
                  </p>

                  <p className="mt-4 text-gray-600 line-clamp-3">
                    {
                      job.description
                    }
                  </p>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
}

export default JobsPage;
