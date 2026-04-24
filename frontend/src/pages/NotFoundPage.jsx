import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-blue-600">
        404
      </h1>

      <h2 className="text-3xl font-bold mt-5">
        Page Not Found
      </h2>

      <p className="mt-4 text-gray-600 leading-7">
        The page you are looking for does not
        exist or may have been moved.
      </p>

      <Link
        to="/"
        className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
