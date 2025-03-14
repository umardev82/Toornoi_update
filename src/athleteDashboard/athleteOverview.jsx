import { useState, useEffect } from "react";
import axios from "axios";
import useAthleteProfile from "../hooks/useAtheleteProfile";
import userProfileImage from "../assets/images/profile.png";
import userProfileCover from "../assets/images/profile-bg.png";
import { FaChartLine, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import imgStar from "../assets/images/img-star.png";
import imgTrophy from "../assets/images/img-trophy.png";
import { GoDotFill } from "react-icons/go";
import API_BASE_URL from "../config";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AthleteOverview = () => {
  const { profile, error } = useAthleteProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [tournamentCount, setTournamentCount] = useState(null);
  const [tournamentResults, setTournamentResults] = useState({
    tournaments_won: 0,
    tournaments_lost: 0,
    total_prize: 0,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (activeTab === "profile" && userToken) {
      fetchProfileData();
    }
  }, [activeTab, userToken]);

  const fetchProfileData = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const [countResponse, resultsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/user/tournaments/count/`, {
          headers: { Authorization: `Token ${userToken}` },
        }),
        axios.get(`${API_BASE_URL}/user/tournaments/results/`, {
          headers: { Authorization: `Token ${userToken}` },
        }),
      ]);

      setTournamentCount(countResponse.data.total_tournamnets_participated);
      setTournamentResults(resultsResponse.data);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="w-full flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const pieData = {
    labels: ['Victoires', 'Pertes'],
    datasets: [
      {
        data: [tournamentResults.tournaments_won, tournamentResults.tournaments_lost],
        backgroundColor: ['#62B2FD', '#9BDFC4'],
        hoverBackgroundColor: ['#62B2FD', '#9BDFC4']
      }
    ]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Tournaments Played',
        data: [tournamentCount],
        backgroundColor: '#36A2EB',
      }
    ]
  };

  return (
    <>
     <p className=" capitalize  text-white  font-bold text-2xl mb-4 border-l-4 pl-4 border-(--accent)">Bienvenue, <span>{profile.first_name} {profile.last_name}! </span></p>
      <div className="h-44" >
        <img src={userProfileCover} alt="Cover" className="w-full h-full object-cover rounded-lg" />
       
      </div>

      <div className="text-center md:flex md:pl-5">
     
        <div className="sm:min-w-36">
          <img
            src={profile.photo || userProfileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 -mt-16"
          />
        
        </div>
        <div className="w-full flex justify-between py-5">
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-(--textwhite)">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-gray-400">{profile.email}</p>
          </div>
          <div className="">
            <Link to="/my-account/profile" className="md:mt-3 px-4 py-2 bg-(--accent) text-(--textwhite) rounded-md">
            Voir le profil
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-(--border) md:flex gap-6 mt-4">
        <button
          className={`py-2 px-4 flex items-center md:w-auto w-full gap-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("profile")}
        >
          <FaChartLine /> Aperçu des performances
        </button>
        <button
          className={`py-2 px-4 flex items-center md:w-auto w-full gap-2 ${activeTab === "stats" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("stats")}
        >
          <FaTrophy /> Statistiques et réalisations

        </button>
      </div>

      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-(--primary) p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <img src={imgTrophy} alt="" className="w-[60px]" />
                </div>
                <div>
                  <p className="text-3xl text-white">{tournamentCount}</p>
                  <h4 className="text-(--textlight)">Nombre total de tournois auxquels vous avez participé</h4>
                </div>
              </div>
            </div>
            <div className="bg-(--primary) p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <img src={imgStar} alt="" className="w-[60px]" />
                </div>
                <div>
                  <p className="text-3xl text-white">{tournamentResults.total_prize}</p>
                  <h4 className="text-(--textlight)">Total des points gagnés</h4>
                </div>
              </div>
            </div>
            <div className="bg-(--primary) rounded-lg">
              <div>
                <h4 className="text-white border-b border-(--border) p-4">Ratio victoires/défaites</h4>
              </div>
              <div className="md:flex justify-between items-center p-4">
                <div className="w-[200px]">
                  <Pie data={pieData} />
                </div>
                <div>
                  <h4 className="text-(--textlight) mt-3">Tournois auxquels vous avez participé <span className="pl-4">{tournamentCount}</span></h4>
                  <div className="flex items-center md:justify-end text-(--textlight)">
                    <div className="flex items-center pr-5"><GoDotFill className="text-[#62B2FD]" /> Victoires</div>
                    <h1 className="text-white text-xl font-bold"> {tournamentResults.tournaments_won}</h1>
                  </div>
                  <div className="flex items-center md:justify-end text-(--textlight)">
                    <div className="flex items-center pr-5"><GoDotFill className="text-[#9BDFC4]" /> Pertes
                    </div>
                    <h1 className="text-white text-xl font-bold">{tournamentResults.tournaments_lost}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <>
            <div className="w-full">
              <h3 className="text-white text-lg font-semibold mb-4">Tournois joués</h3>
              <div className="md:w-1/2">
                <Bar data={barData} className="bg-(--primary) p-5 rounded-lg !w-full !h-full" />
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold my-5">Statistiques</h3>
              <div className="mt-4 md:grid grid-cols-2 gap-3 space-y-1">
                <div className="flex flex-col gap-0 text-(--textwhite)">
                  <p className="font-bold">Tournois joués</p>
                  <p className="text-(--textlight)">{tournamentCount}</p>
                </div>
                <div className="flex flex-col gap-0 text-(--textwhite)">
                  <p className="font-bold">Victoires/Défaites</p>
                  <p className="text-(--textlight)">{tournamentResults.tournaments_won}/{tournamentResults.tournaments_lost}</p>
                </div>
                <div className="flex flex-col gap-0 text-(--textwhite)">
                  <p className="font-bold">Total des prix gagnés</p>
                  <p className="text-(--textlight)">{tournamentResults.total_prize}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AthleteOverview;