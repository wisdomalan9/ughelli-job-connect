import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function UpgradePage() {
  const phone = "2349167404311";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const plans = [
    {
      name: "FREE",
      price: "₦0",
      amount: 0,
      type: "free",
      color: "border-gray-300",
      button: "bg-gray-600",
      benefits: [
        "3 applications weekly",
        "Basic profile",
        "Standard visibility",
      ],
    },
    {
      name: "PLUS",
      price: "₦2,000",
      amount: 2000,
      type: "premium_plus",
      color: "border-blue-400",
      button: "bg-blue-600",
      benefits: [
        "15 applications weekly",
        "Priority alerts",
        "Better visibility",
      ],
    },
    {
      name: "PREMIUM",
      price: "₦5,000",
      amount: 5000,
      type: "premium_pro",
      color: "border-yellow-400",
      button: "bg-yellow-500",
      benefits: [
        "Unlimited applications",
        "Top employer visibility",
        "Priority support",
      ],
    },
    {
      name: "ELITE",
      price: "₦10,000",
      amount: 10000,
      type: "premium_elite",
      color: "border-purple-400",
      button: "bg-purple-600",
      benefits: [
        "Everything in Premium",
        "Trusted Elite badge",
        "VIP support",
      ],
    },
  ];

  /* =========================
     HANDLE UPGRADE (FINAL)
  ========================= */
  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      /* STEP 1: SAVE PAYMENT */
      await api.post("/payments", {
        type: plan.type,
        amount: plan.amount,
        planName: plan.name,
        note: "User initiated upgrade",
      });

      /* STEP 2: OPEN WHATSAPP */
      const message =
        `Hello Admin, I just initiated payment for ${plan.name} plan (${plan.price}).%0A` +
        `Please provide payment details.%0A%0A` +
        `Ughelli Job Connect`;

      window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
      );

      setMessage(
        "✅ Payment request submitted. Please complete payment on WhatsApp."
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to start upgrade."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Upgrade Your Plan
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Start your upgrade and complete payment via WhatsApp.
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow border-2 ${plan.color} p-6 flex flex-col`}
          >
            <h2 className="text-2xl font-bold text-center">
              {plan.name}
            </h2>

            <p className="text-center text-3xl font-bold mt-4">
              {plan.price}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-gray-700 flex-1">
              {plan.benefits.map((item, i) => (
                <li key={i}>✅ {item}</li>
              ))}
            </ul>

            {plan.name === "FREE" ? (
              <Link
                to="/jobs"
                className="mt-6 block text-center bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Continue Free
              </Link>
            ) : (
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={loading}
                className={`mt-6 text-white py-3 rounded-lg hover:opacity-90 ${plan.button}`}
              >
                {loading ? "Processing..." : "Upgrade Now"}
              </button>
            )}
          </div>
        ))}

      </div>

      {/* Trust Section */}
      <div className="mt-14 bg-white rounded-2xl shadow border p-8">
        <h2 className="text-2xl font-bold text-center">
          Why Upgrade?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-8 text-center">

          <div>
            <p className="text-4xl">🚀</p>
            <h3 className="font-bold mt-2">
              Faster Hiring
            </h3>
          </div>

          <div>
            <p className="text-4xl">⭐</p>
            <h3 className="font-bold mt-2">
              Better Visibility
            </h3>
          </div>

          <div>
            <p className="text-4xl">🛡️</p>
            <h3 className="font-bold mt-2">
              Trusted Platform
            </h3>
          </div>

        </div>
      </div>

    </div>
  );
}

export default UpgradePage;
