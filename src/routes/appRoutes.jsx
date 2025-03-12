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
import CookiesPolicy from "../pages/cookiesPolicy";
import TermsAndConditions from "../pages/termsAndConditions";
import LegalInformationPage from "../pages/legalInformationPage";
import Contact from "../pages/contact";
import AthleteProfile from "../athleteDashboard/athleteProfile";
import EditAthleteProfile from "../athleteDashboard/editAtheleteProfile";
import AllAthletes from "../adminDashboard/allAthletes";
import AddAthlete from "../adminDashboard/addAthlete";
import EditAthlete from "../adminDashboard/editAthlete";
import AddMatch from "../adminDashboard/addMatch";
import AllMatches from "../adminDashboard/allMatches";
import EditMatch from "../adminDashboard/editMatch";
import RegisteredAthletes from "../adminDashboard/registeredAthletes";
import UserMatches from "../athleteDashboard/userMatches";
import RegisteredAthletesTournaments from "../adminDashboard/regAthletesForTournaments";
import Payments from "../adminDashboard/payments";
import MyTournaments from "../athleteDashboard/myTournaments";
import CreatePool from "../adminDashboard/createPools";
import PoolList from "../adminDashboard/poolsList";
import ViewMatch from "../athleteDashboard/viewMatch";
import PoolDetails from "../adminDashboard/viewPool";
import Chat from "../athleteDashboard/chat";
import Claim from "../athleteDashboard/claim";
import AllClaims from "../adminDashboard/allClaims";
import ScrollToTop from "./scrollToTop";
import AllFeaturedTournamentsPage from "../pages/allFeaturedTournamentsPage";
import SingleTournamentLanding from "../pages/singleTournamentLanding";
import MyTournamentView from "../athleteDashboard/myTournamentView";
import AllPrizes from "../adminDashboard/prizes";
import AthleteOverview from "../athleteDashboard/athleteOverview";



const AppRoutes = () => {
  return (
    <BrowserRouter>
    
    <ScrollToTop/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cookies-policy" element={<CookiesPolicy/>} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />   
        <Route path="/legal-information" element={<LegalInformationPage/>} />      
        <Route path="/contact-us" element={<Contact/>} />  
        <Route path="/all-tournaments" element={<AllFeaturedTournamentsPage/>}/>  
        <Route path="/tournament/:id" element={<SingleTournamentLanding />} />          

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
          <Route path="add-match" element={<AddMatch/>}/>
          <Route path="all-matches" element={<AllMatches/>}/>
          <Route path="edit-match/:id" element={<EditMatch/>} />
          <Route path="registered-athletes" element={<RegisteredAthletes />} />
          <Route path="tournaments/:tournament_id/registered-athletes" element={<RegisteredAthletesTournaments />} />
          <Route path="payments" element={<Payments/>} />
          <Route path="create-pools" element={<CreatePool/>}/>
          <Route path="pools" element={<PoolList/>}/>  
          <Route path="pools/:poolId" element={<PoolDetails />} />  
          <Route path="support-tickets" element={<AllClaims />} />   
          <Route path="prizes" element={<AllPrizes />} />     


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
          <Route index element={<AthleteOverview/>} />
          <Route  path="tournaments" element={<AllTournaments />} />
          <Route path="tournament/:id" element={<SingleTournament/>} />
          <Route path="profile" element={<AthleteProfile/>}/>
          <Route path="settings" element={<EditAthleteProfile/>} />
          <Route path="matches" element={<UserMatches/>}/>
          <Route path="my-tournaments" element={<MyTournaments/>}/>
          <Route path="my-tournaments/:id" element={<MyTournamentView/>} />
          <Route path="match/:id" element={<ViewMatch/>}/>
          <Route path="matches/:id/chat" element={<Chat/>} />
          <Route path="support-ticket" element={<Claim/>} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
