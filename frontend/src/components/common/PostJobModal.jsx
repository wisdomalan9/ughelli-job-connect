import { useState } from "react";
import axios from "axios";

function PostJobModal({
  isOpen,
  onClose,
  token,
}) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    location: "",
    salary: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/jobs",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      onClose();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Error posting job"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">
            Post Vacancy
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4 mt-5">
          <input name="title" placeholder="Job Title" onChange={handleChange} className="w-full border px-4 py-3 rounded-lg" />
          <input name="company" placeholder="Business Name" onChange={handleChange} className="w-full border px-4 py-3 rounded-lg" />
          <input name="category" placeholder="Category" onChange={handleChange} className="w-full border px-4 py-3 rounded-lg" />
          <input name="location" placeholder="Location" onChange={handleChange} className="w-full border px-4 py-3 rounded-lg" />
          <input name="salary" placeholder="Salary" onChange={handleChange} className="w-full border px-4 py-3 rounded-lg" />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          ></textarea>

          <button
            onClick={submit}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold"
          >
            Post Job ₦2,000
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostJobModal;
