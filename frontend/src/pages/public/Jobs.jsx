import { useEffect, useState } from "react";
import axios from "axios";

import SearchBar from "../../components/common/SearchBar";
import JobCard from "../../components/common/JobCard";
import UpgradeModal from "../../components/common/UpgradeModal";
import AuthModal from "../../components/common/AuthModal";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [upgradeOpen, setUpgradeOpen] =
    useState(false);

  const [loginOpen, setLoginOpen] =
    useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/jobs"
      );

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">
        Browse Jobs
      </h1>

      <div className="mt-8">
        <SearchBar />
      </div>

      {loading ? (
        <p className="mt-10">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <p className="mt-10 text-slate-500">
          No jobs posted yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              id={job._id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              openUpgrade={() =>
                setUpgradeOpen(true)
              }
              openLogin={() =>
                setLoginOpen(true)
              }
            />
          ))}
        </div>
      )}

      <UpgradeModal
        open={upgradeOpen}
        close={() =>
          setUpgradeOpen(false)
        }
      />

      <AuthModal
        isOpen={loginOpen}
        onClose={() =>
          setLoginOpen(false)
        }
      />
    </section>
  );
}

export default Jobs;
