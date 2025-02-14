import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import AdminLogin from "../pages/adminLogin";
import Signup from "../pages/signup";
import AdminDashboardLayout from "../layouts/adminDashboardLayout";
import AthleteDashboardLayout from "../layouts/athleteDashboardLayout";
import Overview from "../adminDashboard/overview";
import AddTournament from "../adminDashboard/addTournament";
import TournamentList from "../adminDashboard/tournamentList";
import AllTournaments from "../athleteDashboard/allTournaments";
import Profile from "../adminDashboard/profile";
import EditProfile from "../adminDashboard/editProfile";
import EditTournament from "../adminDashboard/editTournament";
import ViewTournament from "../adminDashboard/viewTournament";
import SingleTournament from "../athleteDashboard/singleTournament";
import NotFoundPage from "../pages/404";
import VerifyEmail from "../pages/verifyEmail";
import Login from "../pages/login";
import PrivateRoute from "./privateRoutes";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";
import AthleteProfile from "../athleteDashboard/athleteProfile";
import EditAthleteProfile from "../athleteDashboard/editAtheleteProfile";
import AllAthletes from "../adminDashboard/allAthletes";
import AddAthlete from "../adminDashboard/addAthlete";
import EditAthlete from "../adminDashboard/editAthlete";


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
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <Route path="all-athletes" element={<AllAthletes/>}/>
          <Route path="add-athlete" element={<AddAthlete/>}/>
          <Route path="edit-athlete/:id" element={<EditAthlete/>}/>
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
          <Route  path="tournaments" element={<AllTournaments />} />
          <Route path="tournament/:id" element={<SingleTournament/>} />
          <Route path="profile" element={<AthleteProfile/>}/>
          <Route path="settings" element={<EditAthleteProfile/>} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
