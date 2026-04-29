import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/payments");

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/payments/${id}/approve`);
      loadPayments();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/payments/${id}/reject`);
      loadPayments();
    } catch (err) {
      alert("Failed to reject");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Payment Management
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && payments.length === 0 && (
        <p>No payments yet.</p>
      )}

      <div className="grid gap-4">
        {payments.map((p) => (
          <div
            key={p._id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <div className="flex justify-between flex-wrap gap-3">

              <div>
                <p className="font-bold">
                  {p.userId?.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  {p.userId?.email}
                </p>
                <p className="text-sm">
                  Plan: {p.planName}
                </p>
                <p className="text-sm">
                  Amount: ₦{p.amount}
                </p>
                <p className="text-sm">
                  Status: {p.status}
                </p>
              </div>

              {p.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(p._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(p._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPaymentsPage;
