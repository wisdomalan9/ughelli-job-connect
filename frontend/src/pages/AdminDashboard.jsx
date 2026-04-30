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

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [viewedReceipts, setViewedReceipts] = useState([]);

  /* FILTERS */
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* =========================
     LOAD DATA
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
    if (!viewedReceipts.includes(id)) {
      return alert("⚠️ You must view receipt before approving.");
    }

    try {
      await api.put(`/payments/${id}/approve`);
      setMessage("Payment approved.");
      loadData();
    } catch (err) {
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
      alert("Failed to reject payment");
    }
  };

  /* =========================
     IMAGE URL
  ========================= */
  const getImageUrl = (path) => {
    if (!path) return "";
    return `${
      import.meta.env.VITE_API_URL?.replace("/api/v1", "") || ""
    }${path}`;
  };

  /* =========================
     VIEW RECEIPT
  ========================= */
  const handleViewReceipt = (item) => {
    setSelectedReceipt(getImageUrl(item.receiptImage));

    if (!viewedReceipts.includes(item._id)) {
      setViewedReceipts([...viewedReceipts, item._id]);
    }
  };

  /* =========================
     FILTER + SEARCH
  ========================= */
  const filteredPayments = payments.filter((item) => {
    const matchFilter =
      filter === "all" || item.status === filter;

    const userName =
      item.userId?.fullName?.toLowerCase() || "";

    const email =
      item.userId?.email?.toLowerCase() || "";

    const ref =
      item.reference?.toLowerCase() || "";

    const searchTerm = search.toLowerCase();

    const matchSearch =
      userName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      ref.includes(searchTerm);

    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Elite payment control system
      </p>

      {message && (
        <div className="mt-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* =========================
          STATS
      ========================= */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        <Stat title="Revenue" value={`₦${stats.revenue}`} />
        <Stat title="Approved" value={stats.approved} />
        <Stat title="Pending" value={stats.pending} />
        <Stat title="Rejected" value={stats.rejected} />
      </div>

      {/* =========================
          FILTER + SEARCH
      ========================= */}
      <div className="mt-10 flex flex-col md:flex-row gap-4">

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, email or reference..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-full"
        />

      </div>

      {/* =========================
          PAYMENTS
      ========================= */}
      <div className="mt-8">

        {loading && (
          <div className="text-center py-10">
            Loading...
          </div>
        )}

        {!loading && filteredPayments.length === 0 && (
          <div className="bg-white p-8 text-center rounded-xl">
            No payments found.
          </div>
        )}

        <div className="grid gap-5">

          {filteredPayments.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow border p-6"
            >

              <div className="flex flex-col md:flex-row justify-between gap-5">

                {/* LEFT */}
                <div>
                  <h3 className="font-bold text-lg">
                    {item.planName || item.type}
                  </h3>

                  <p className="text-gray-600">
                    ₦{item.amount}
                  </p>

                  <p className="text-sm text-gray-500">
                    Ref: {item.reference || "N/A"}
                  </p>

                  {/* USER INFO */}
                  <div className="mt-2 text-sm text-gray-600">
                    👤 {item.userId?.fullName || "Unknown"}
                    <br />
                    📧 {item.userId?.email || "N/A"}
                  </div>

                  <p className="text-sm mt-2">
                    Status: {item.status}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-3">

                  {/* VIEW RECEIPT */}
                  {item.receiptImage && (
                    <button
                      onClick={() =>
                        handleViewReceipt(item)
                      }
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      View Receipt
                    </button>
                  )}

                  {/* ACTIONS */}
                  {item.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          approve(item._id)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          reject(item._id)
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* =========================
          RECEIPT MODAL
      ========================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl max-w-lg w-full">
            <img
              src={selectedReceipt}
              alt="Receipt"
              className="w-full rounded"
            />

            <button
              onClick={() =>
                setSelectedReceipt(null)
              }
              className="mt-4 w-full bg-red-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================
   SMALL COMPONENT
========================= */
function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow border p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
