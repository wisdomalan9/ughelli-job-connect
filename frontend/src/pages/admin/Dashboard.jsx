import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-500">
            Users
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {stats.users}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-500">
            Jobs
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {stats.jobs}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-500">
            Applications
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {stats.applications}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-500">
            Revenue
          </p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">
            ₦{stats.revenue}
          </h2>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
