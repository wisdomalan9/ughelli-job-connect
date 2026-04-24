import { Link } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import JobCard from "../../components/common/JobCard";

function Home() {
  return (
    <section>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Jobs or Hire Staff in Ughelli
            </h1>

            <p className="mt-5 text-lg text-blue-100">
              Empowering Careers, Building Futures.
            </p>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Latest Jobs</h2>

          <Link to="/jobs" className="text-blue-900 font-semibold">
            View All
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <JobCard
            title="Sales Girl Needed"
            company="Blessed Store"
            location="Ughelli Town"
            salary="₦45,000"
          />

          <JobCard
            title="Cashier Wanted"
            company="Mega Mart"
            location="Otovwodo"
            salary="₦55,000"
          />

          <JobCard
            title="Receptionist"
            company="Royal Hotel"
            location="Ekiugbo"
            salary="₦60,000"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h2 className="text-3xl font-bold">
            Need Staff Fast?
          </h2>

          <p className="mt-3">
            Post your vacancy and get qualified applicants quickly.
          </p>

          <button className="mt-6 bg-white text-orange-600 px-6 py-3 rounded-lg font-bold">
            Post Vacancy
          </button>
        </div>
      </div>
    </section>
  );
}

export default Home;
