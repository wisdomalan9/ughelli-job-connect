import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Jobs Faster in Ughelli
            </h1>

            <p className="mt-5 text-lg text-blue-100 leading-8">
              Connect with trusted employers,
              discover real opportunities, and
              grow your future with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/jobs"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Browse Jobs
              </Link>

              <Link
                to="/register"
                className="bg-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-950"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="bg-white text-gray-900 rounded-xl p-4">
                ✅ Verified Employers
              </div>

              <div className="bg-white text-gray-900 rounded-xl p-4">
                ✅ Easy Applications
              </div>

              <div className="bg-white text-gray-900 rounded-xl p-4">
                ✅ Fast Hiring Process
              </div>

              <div className="bg-white text-gray-900 rounded-xl p-4">
                ✅ Local Opportunities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">
          Why Choose Ughelli Job Connect?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl">
              Trusted Employers
            </h3>
            <p className="mt-3 text-gray-600">
              We help connect job seekers with
              serious businesses hiring now.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl">
              Easy To Apply
            </h3>
            <p className="mt-3 text-gray-600">
              Apply quickly without stress and
              track your progress.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-xl">
              Grow Locally
            </h3>
            <p className="mt-3 text-gray-600">
              Discover opportunities in Ughelli
              and nearby areas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready To Start?
          </h2>

          <p className="mt-4 text-gray-600">
            Join job seekers and employers using
            our platform today.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Account
            </Link>

            <Link
              to="/jobs"
              className="bg-white border px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
