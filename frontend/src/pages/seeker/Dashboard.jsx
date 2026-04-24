function Dashboard() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">
        Job Seeker Dashboard
      </h1>

      <p className="mt-3 text-slate-600">
        Manage your applications and find jobs.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold">
            Applications Left
          </h3>
          <p className="text-3xl font-bold text-blue-900 mt-3">
            3
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold">
            Applied Jobs
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-3">
            0
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold">
            Premium Plan
          </h3>
          <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg">
            Upgrade ₦200
          </button>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
