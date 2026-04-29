import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
     ACTIONS
  ========================= */

  const suspendUser = async (id) => {
    if (!confirm("Suspend this user?")) return;

    try {
      await api.put(`/admin/users/${id}/suspend`);
      loadUsers();
    } catch {
      alert("Failed");
    }
  };

  const verifyUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify`);
      loadUsers();
    } catch {
      alert("Failed");
    }
  };

  const makeAdmin = async (id) => {
    if (!confirm("Make this user admin?")) return;

    try {
      await api.put(`/admin/users/${id}/make-admin`);
      loadUsers();
    } catch {
      alert("Failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && (
        <p>No users found.</p>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">

              {/* USER INFO */}
              <div>
                <p className="font-bold text-lg">
                  {user.fullName}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email}
                </p>

                <p className="text-sm">
                  Role: {user.role}
                </p>

                <p className="text-sm">
                  Plan: {user.premiumPlan}
                </p>

                <p className="text-sm">
                  Verified: {user.isVerified ? "Yes" : "No"}
                </p>

                <p className="text-sm">
                  Status: {user.isSuspended ? "Suspended" : "Active"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() => suspendUser(user._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  {user.isSuspended ? "Unsuspend" : "Suspend"}
                </button>

                <button
                  onClick={() => verifyUser(user._id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  {user.isVerified ? "Unverify" : "Verify"}
                </button>

                {user.role !== "admin" && (
                  <button
                    onClick={() => makeAdmin(user._id)}
                    className="bg-purple-600 text-white px-3 py-2 rounded"
                  >
                    Make Admin
                  </button>
                )}

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsersPage;
