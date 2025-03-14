import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import VsImg from "../assets/images/vs.png";
import User1 from "../assets/images/user-1.png";
import User2 from "../assets/images/user-2.png";
import { Toaster,toast } from "react-hot-toast";
import { Link } from "react-router-dom";


const ViewMatch = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoreInput, setScoreInput] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    fetchMatchDetails();
  }, []);

  const fetchMatchDetails = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Aucun jeton d'authentification trouvé !");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/user/matches/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMatch(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching match details:", error.response?.data || error.message);
      setLoading(false);
      toast.error(error.response?.data?.message || "Échec de la récupération des détails du match.");
    }
  };

  const handleFileChange = (event) => {
    setScreenshot(event.target.files[0]); // Store the uploaded file
  };
  
  const handleUpdateScore = async () => {
    if (!scoreInput.trim()) {
      toast.error("Veuillez saisir un score valide.");
      return;
    }
  
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Aucun jeton d'authentification trouvé !");
        return;
      }
  
      const formData = new FormData();
      formData.append("score", Number(scoreInput));
      if (screenshot) {
        formData.append("screenshot", screenshot); // Add the uploaded file
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/user/matches/${id}/update_match_result/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.message || "Score mis à jour avec succès !");
        fetchMatchDetails(); // Refresh match details
        setIsModalOpen(false);
        setScoreInput("");
        setScreenshot(null);
      } else {
        toast.error(response.data.message || "Échec de la mise à jour du score.");
      }
    } catch (error) {
      console.error("Error updating score:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  
  if (loading) return <div className="w-full flex justify-center items-center min-h-[300px]">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
</div>;
  if (!match) return <div className="text-center text-red-500">Correspondance non trouvée.</div>;

  return (
    <div className="bg-black text-white">
    {/* <Toaster toastOptions={{ duration: 5000 }} /> */}

      {/* Header Section */}
      <div>
        <div className="md:flex justify-between items-center mb-4">
        <a href="/my-account/matches" className="text-sm mb-4 text-white flex flex-wrap items-center gap-2">
          <span><TiArrowBackOutline className="text-2xl" /> </span>Tournois <span><IoIosArrowForward /></span> {match.tournament?.tournament_name} <span><IoIosArrowForward /></span> Correspondre
        </a>
        <Link to={`/my-account/matches/${match.id}/chat`} className="px-4 py-2 bg-(--accent) rounded text-white">Démarrer le chat Score</Link>
        </div>
       

        {/* Match Banner */}
        <div className="bg-[url('/src/assets/images/header-1.png')] bg-center bg-cover bg-no-repeat rounded-lg p-10 text-center">
          <div className="bg-white text-black py-1 w-fit mx-auto px-6 rounded-md mb-5">
            <h1 className="">Score</h1>
            <h1 className="font-bold">{match.result?.player_1_score ?? "0"}-{match.result?.player_2_score ?? "0"}</h1>
          </div>
          <div className="flex justify-center gap-3 items-center">
            <div className="flex flex-col items-center">
              <img src={match.player_1_photo || User1} alt="Player 1" className="w-20 h-20 object-cover rounded-2xl" />
              <p className="text-lg font-semibold">{match.player_1 || "Player 1"}</p>
            </div>
            <div>
              <img src={VsImg} alt="" />
            </div>
            <div className="flex flex-col items-center">
              <img src={match.player_2_photo || User2} alt="Player 2" className="w-20 h-20 object-cover rounded-2xl" />
              <p className="text-lg font-semibold">{match.player_2 || "Player 2"}</p>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="mt-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold md:w-full w-[50%]"><span className="capitalize">{match.player_1} </span>vs <span className="capitalize">{match.player_2}</span></h2>
              <p className="text-(--textlight) mt-1">Date: {match.date ? new Date(match.date).toLocaleDateString() : "TBD"}</p>
              <p className="text-(--textlight)">Localisation: {match.tournament?.country || "Unknown"}</p>
            </div>
            <button className="px-4 py-2 bg-(--accent) rounded" onClick={() => setIsModalOpen(true)}>
            Rapport
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-(--textwhite) font-semibold">Organisateur</p>
              <p className="text-(--textlight)">{match.tournament?.sponsorship_details || "Unknown"}</p>
            </div>
            <div>
              <p className="text-(--textwhite) font-semibold">Arbitre</p>
              <p className="text-(--textlight)">{match.admin_username || "Unknown"}</p>
            </div>
            <div>
              <p className="text-(--textwhite) mb-2 font-semibold">Statut</p>
              <span className={`px-3 py-1 text-sm rounded-4xl ${
                match.status === "Pending" ? "bg-[#433E29] text-[#E5BA18]" :
                match.status === "Completed" ? "bg-[#003515] text-[#00BB4C]" : "bg-gray-600"
              }`}>
                {match.status || "En attente"}
              </span>
            </div>
            <div>
              <p className="text-(--textwhite) font-semibold">Type de correspondance</p>
              <p className="text-(--textlight)">{match.tournament?.bracket_type || "Inconnu"}</p>
            </div>
          </div>

          {/* Match Description */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">À propos</h3>
            <p className="text-(--textlight) mt-2">
              {match.tournament?.description || "Aucune information supplémentaire fournie."}
            </p>
          </div>

          {/* Rules & Regulations */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Règles et règlements            </h3>
            <p className="text-(--textlight) mt-2">
              {match.tournament?.rules_and_regulations || "Les règles de jeu standard s'appliquent. Veuillez respecter scrupuleusement le règlement du jeu."}
            </p>
          </div>
        </div>
      
      </div>
      

      {/* Modal for Score Update */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-5">
          <div className="bg-(--primary) text-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Mettre à jour le score</h2>
            <p>
              <strong>Tournoi:</strong> {match.tournament?.tournament_name || "Pending"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {match.date ? new Date(match.date).toLocaleString("en-GB") : "Pending"}
            </p>
            <p>
              <strong>Joueur 1:</strong> {match.player_1 || "Pending"}
            </p>
            <p>
              <strong>Joueur 2:</strong> {match.player_2 || "Pending"}
            </p>
            <p>
              <strong>Gagnant:</strong> {match.winner || "Pending"}
            </p>
            {match.status !== "Completed" && (
  <div className="mt-4">
    <label className="block text-sm font-medium">Entrez le score :</label>
    <input
      type="number"
      placeholder="Entrez le score"
      value={scoreInput}
      onChange={(e) => setScoreInput(e.target.value)}
      className="w-full bg-gray-800 text-white p-2 rounded mt-2"
    />

    <label className="block text-sm font-medium mt-4">Télécharger une capture d'écran :</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full bg-gray-800 text-white p-2 rounded mt-2"
    />
  </div>
)}


            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 bg-[#7A3D39] rounded " onClick={() => setIsModalOpen(false)}>
              Fermer
              </button>
              {match.status !== "Completed" && (
                <button className="px-4 py-2 bg-(--accent) rounded " onClick={handleUpdateScore}>
                  Mettre à jour le score
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMatch;