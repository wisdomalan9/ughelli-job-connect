import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* =========================
     LOAD DATA (FIXED)
  ========================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const [statsRes, payRes] = await Promise.all([
        api.get("/payments/admin/stats"),
        api.get("/payments/admin/list"),
      ]);

      setStats(statsRes.data.stats || {});
      setPayments(payRes.data.payments || []);
    } catch (err) {
      console.log("Admin error:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const approve = async (id) => {
    try {
      await api.put(`/payments/${id}/approve`);
      setMessage("Payment approved.");
      loadData();
    } catch (err) {
      console.log(err);
      alert("Failed to approve payment");
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/payments/${id}/reject`, {
        reason: "Rejected by admin",
      });
      setMessage("Payment rejected.");
      loadData();
    } catch (err) {
      console.log(err);
      alert("Failed to reject payment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Manage platform revenue and approvals.
      </p>

      {message && (
        <div className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">

        <div className="bg-white rounded-2xl shadow border p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-green-700">
            ₦{stats.revenue || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow border p-5">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-blue-700">
            {stats.approved || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow border p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pending || 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow border p-5">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.rejected || 0}
          </p>
        </div>

      </div>

      {/* PAYMENTS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Submitted Payments
        </h2>

        {loading && (
          <div className="py-8 text-center font-semibold">
            Loading...
          </div>
        )}

        {!loading && payments.length === 0 && (
          <div className="bg-white mt-5 rounded-2xl shadow border p-8 text-center">
            No payments found.
          </div>
        )}

        {!loading && payments.length > 0 && (
          <div className="grid gap-5 mt-5">
            {payments.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow border p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-5">

                  <div>
                    <h3 className="text-lg font-bold">
                      {item.planName || item.type}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      ₦{item.amount}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Ref: {item.reference || "N/A"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Status: {item.status}
                    </p>
                  </div>

                  {item.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => approve(item._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(item._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
