import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import AdminLogin from "../pages/adminLogin";
import Signup from "../pages/signup";
import AdminDashboardLayout from "../layouts/adminDashboardLayout";
import AthleteDashboardLayout from "../layouts/athleteDashboardLayout";
import Overview from "../adminDashboard/overview";
import AddTournament from "../adminDashboard/addTournament";
import TournamentList from "../adminDashboard/tournamentList";
import Profile from "../adminDashboard/profile";
import EditProfile from "../adminDashboard/editProfile";
import EditTournament from "../adminDashboard/editTournament";
import ViewTournament from "../adminDashboard/viewTournament";
import NotFoundPage from "../pages/404";
import VerifyEmail from "../pages/verifyEmail";
import Login from "../pages/login";
import PrivateRoute from "./privateRoutes";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute type="admin">
              <AdminDashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="add-tournament" element={<AddTournament />} />
          <Route path="all-tournaments" element={<TournamentList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<EditProfile />} />
          <Route path="edit-tournament/:id" element={<EditTournament />} />
          <Route path="view-tournament/:id" element={<ViewTournament />} />
        </Route>

        {/* User Protected Routes */}
        <Route
          path="/my-account/*"
          element={
            <PrivateRoute type="user">
              <AthleteDashboardLayout />
            </PrivateRoute>
          }
        >
          
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
