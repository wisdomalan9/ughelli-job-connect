import { Link } from "react-router-dom";

function UpgradePage() {
  const phone = "2349167404311";

  const openWhatsApp = (plan, price) => {
    const message =
      `Hello Admin, I want to upgrade to ${plan} plan for ${price}.%0A` +
      `Please guide me on payment and activation.%0A%0A` +
      `Ughelli Job Connect`;

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank"
    );
  };

  const plans = [
    {
      name: "FREE",
      price: "₦0",
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
      color: "border-purple-400",
      button: "bg-purple-600",
      benefits: [
        "Everything in Premium",
        "Trusted Elite badge",
        "VIP support",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Upgrade Your Plan
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Get hired faster, apply more, and stand out to employers.
        </p>
      </div>

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
                onClick={() =>
                  openWhatsApp(
                    plan.name,
                    plan.price
                  )
                }
                className={`mt-6 text-white py-3 rounded-lg hover:opacity-90 ${plan.button}`}
              >
                Upgrade Now
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
            <p className="text-gray-600 text-sm mt-2">
              Premium users are noticed faster by employers.
            </p>
          </div>

          <div>
            <p className="text-4xl">⭐</p>
            <h3 className="font-bold mt-2">
              Better Visibility
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Profiles rank higher in employer searches.
            </p>
          </div>

          <div>
            <p className="text-4xl">🛡️</p>
            <h3 className="font-bold mt-2">
              Trusted Platform
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Secure manual activation after payment confirmation.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default UpgradePage;
