import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Applicants() {
  const { user } = useContext(AuthContext);

  const [apps, setApps] = useState([]);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/applications",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setApps(res.data.applications || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/applications/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      loadApplicants();
    } catch (error) {
      alert("Error updating");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">
        Applicants
      </h1>

      <div className="space-y-5 mt-8">
        {apps.length === 0 ? (
          <p>No applicants yet.</p>
        ) : (
          apps.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow rounded-2xl p-6"
            >
              <h3 className="font-bold text-xl">
                {app.seekerId?.fullName}
              </h3>

              <p className="text-slate-500">
                {app.seekerId?.email}
              </p>

              <p className="mt-2">
                Applied for:{" "}
                <strong>
                  {app.jobId?.title}
                </strong>
              </p>

              <p className="mt-2">
                Status:{" "}
                <span className="font-semibold">
                  {app.status}
                </span>
              </p>

              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "shortlisted"
                    )
                  }
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg"
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "hired"
                    )
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Hired
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "rejected"
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Applicants;
