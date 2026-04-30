import { useEffect, useState } from "react";
import api from "../api/axios";

function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments/my/list");
      setPayments(res.data.payments || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅";
      case "pending":
        return "⏳";
      case "rejected":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold">
        My Payments
      </h1>

      <p className="text-gray-600 mt-2">
        Track your upgrade and payment status.
      </p>

      {/* LOADING */}
      {loading && (
        <div className="py-10 text-center font-semibold">
          Loading payments...
        </div>
      )}

      {/* EMPTY */}
      {!loading && payments.length === 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow border p-8 text-center">
          No payment history yet.
        </div>
      )}

      {/* PAYMENTS */}
      {!loading && payments.length > 0 && (
        <div className="mt-8 grid gap-5">

          {payments.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow border p-6"
            >

              <div className="flex flex-col md:flex-row md:justify-between gap-6">

                {/* LEFT */}
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
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  {/* REJECTION REASON */}
                  {item.status === "rejected" && item.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2">
                      Reason: {item.rejectionReason}
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-3">

                  {/* STATUS */}
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(item.status)}`}
                  >
                    {statusIcon(item.status)} {item.status}
                  </span>

                  {/* RECEIPT IMAGE */}
                  {item.receiptImage && (
                    <a
                      href={`${import.meta.env.VITE_API_URL?.replace("/api/v1", "") || ""}${item.receiptImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline"
                    >
                      View Receipt
                    </a>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default PaymentHistoryPage;
