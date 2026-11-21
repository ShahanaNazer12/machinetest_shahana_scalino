
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PublicWebsite from "./pages/PublicWebsite";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";

import ProtectedRoute from "./components/ProtectedRoute";

import CategoryManagement from "./pages/admin/CategoryManagement";
import MenuManagement from "./pages/admin/MenuManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import OpeningHoursManagement from "./pages/admin/OpeningHoursManagement";
import ReservationManagement from "./pages/admin/ReservationManagement";
import ContactManagement from "./pages/admin/ContactManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicWebsite />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route path="dashboard" element={<DashboardHome />} />

            <Route path="categories" element={<CategoryManagement />} />

            <Route path="menus" element={<MenuManagement />} />

            <Route path="teams" element={<TeamManagement />} />

            <Route path="testimonials" element={<TestimonialManagement />} />

            <Route
              path="opening-hours"
              element={<OpeningHoursManagement />}
            />

            <Route
              path="reservations"
              element={<ReservationManagement />}
            />

            <Route
              path="contacts"
              element={<ContactManagement />}
            />
          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
