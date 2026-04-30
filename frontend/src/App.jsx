import { Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* Public Pages */
import HomePage from "./pages/HomePage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

/* Dashboards */
import SeekerDashboard from "./pages/SeekerDashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/* Admin Pages */
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";

/* New Pages */
import EditProfilePage from "./pages/EditProfilePage.jsx";
import UpgradePage from "./pages/UpgradePage.jsx";

/* Shared */
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PaymentHistoryPage from "./pages/PaymentHistoryPage.jsx";

 
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* UPGRADE */}
          <Route path="/upgrade" element={<UpgradePage />} />

          {/* SEEKER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="seeker">
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute role="seeker">
                <EditProfilePage />
              </ProtectedRoute>
            }
          />

          {/* EMPLOYER */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

<Route
  path="/payments"
  element={
    <ProtectedRoute role="seeker">
      <PaymentHistoryPage />
    </ProtectedRoute>
  }
/>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>

      </main>

      <Footer />
    </div>
  );
}

export default App;
