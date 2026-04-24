import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function JobCard({
  id,
  title,
  company,
  location,
  salary,
  openUpgrade,
  openLogin,
}) {
  const { user } =
    useContext(AuthContext);

  const apply = async () => {
    if (!user) {
      openLogin();
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/applications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      const data =
        error?.response?.data;

      if (data?.premium) {
        openUpgrade();
      } else {
        alert(
          data?.message ||
            "Unable to apply"
        );
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 border hover:shadow-lg transition">
      <div className="flex justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {title}
          </h3>

          <p className="text-slate-500 mt-1">
            {company}
          </p>
        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm h-fit">
          Active
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>📍 {location}</p>
        <p>💰 {salary}</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={apply}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          Apply
        </button>

        <button className="border px-4 py-2 rounded-lg">
          Details
        </button>
      </div>
    </div>
  );
}

export default JobCard;
