import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* =========================
     LOAD USERS
  ========================= */
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =========================
     SUSPEND / UNSUSPEND
  ========================= */
  const toggleSuspend = async (id) => {
    try {
      await api.put(`/admin/users/${id}/suspend`, {
        reason: "Admin action",
      });

      setMessage("User status updated");
      loadUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  /* =========================
     VERIFY USER
  ========================= */
  const verifyUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify`);
      setMessage("User verified");
      loadUsers();
    } catch {
      alert("Failed to verify user");
    }
  };

  /* =========================
     PLAN DISPLAY
  ========================= */
  const getPlanName = (user) => {
    if (user.eliteVerified) return "Elite";
    if (user.premiumPlan === "premium") return "Premium";
    if (user.premiumPlan === "plus") return "Plus";
    return "Free";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold">
        Admin Users Management
      </h1>

      <p className="text-gray-600 mt-2">
        Control all platform users, plans and verification.
      </p>

      {message && (
        <div className="mt-5 bg-green-100 text-green-700 p-4 rounded-lg">
          {message}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="py-10 text-center font-semibold">
          Loading users...
        </div>
      )}

      {/* USERS TABLE */}
      {!loading && (
        <div className="mt-8 overflow-x-auto bg-white shadow border rounded-2xl">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Applications</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">

                  <td className="px-4 py-3">
                    {user.fullName}
                  </td>

                  <td className="px-4 py-3">
                    {user.email}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {user.role}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold">
                      {getPlanName(user)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {user.freeApplicationsLeft}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {user.isSuspended ? (
                      <span className="text-red-600 font-semibold">
                        Suspended
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-2">

                    <button
                      onClick={() => toggleSuspend(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      {user.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>

                    {!user.isVerified && (
                      <button
                        onClick={() => verifyUser(user._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Verify
                      </button>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AdminUsersPage;
