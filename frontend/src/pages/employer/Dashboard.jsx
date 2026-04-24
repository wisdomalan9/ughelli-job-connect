import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import PostJobModal from "../../components/common/PostJobModal";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Employer Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Welcome {user?.user?.fullName}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setOpen(true)}
            className="bg-orange-500 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Post Vacancy ₦2,000
          </button>

          <Link
            to="/employer/applicants"
            className="bg-blue-900 text-white px-5 py-3 rounded-lg text-center font-semibold"
          >
            View Applicants
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="font-semibold">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-900 mt-3">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="font-semibold">Applicants</h3>
          <p className="text-3xl font-bold text-green-600 mt-3">
            0
          </p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="font-semibold">Plan</h3>
          <p className="mt-3">Standard 14 Days</p>
        </div>
      </div>

      <PostJobModal
        isOpen={open}
        onClose={() => setOpen(false)}
        token={user?.token}
      />
    </section>
  );
}

export default Dashboard;
