import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";

const EditMatch = () => {
  const { id } = useParams();
  
  const [matchData, setMatchData] = useState({
    tournament: "",
    player_1: "",
    player_2: "",
    stage: "",
    date: "",
    winner: null,
    result: {
      player_1_score: null,
      player_2_score: null,
      player_1_screenshot: null,  
      player_2_screenshot: null,  
    },
    status: "Pending",   
  });

  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, playerRes, matchRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/tournaments/`),
          axios.get(`${API_BASE_URL}/users/`),
          axios.get(`${API_BASE_URL}/matches/${id}/`),
        ]);
  
        console.log("Match API Response:", matchRes.data); // Debugging
  
        setTournaments(tournamentRes.data);
        setPlayers(playerRes.data);
  
        if (matchRes.data) {
          // Find tournament ID based on name
          const tournamentId = tournamentRes.data.find(t => t.tournament_name === matchRes.data.tournament?.tournament_name)?.id || "";
  
          // Find player IDs based on usernames
          const player1Id = playerRes.data.find(p => p.username === matchRes.data.player_1)?.id || "";
          const player2Id = playerRes.data.find(p => p.username === matchRes.data.player_2)?.id || "";
          const winnerId = playerRes.data.find(p => p.username === matchRes.data.winner)?.id || "";
  
          // Update state with properly formatted data
          setMatchData((prevData) => ({
            ...prevData,
            tournament: tournamentId,
            player_1: player1Id,
            player_2: player2Id,
            winner: winnerId,
            date: matchRes.data.date || "",
            status: matchRes.data.status || "Pending",
            result: {
              player_1_score: matchRes.data.result?.player_1_score || 0,
              player_2_score: matchRes.data.result?.player_2_score || 0,
              player_1_screenshot: matchRes.data.result?.player_1_screenshot || null,
              player_2_screenshot: matchRes.data.result?.player_2_screenshot || null,
            },
          }));
        }
      } catch (error) {
        toast.error("Échec de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchData();
    } else {
      toast.error("L'ID de correspondance est manquant.");
    }
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file") {
      setMatchData({ ...matchData, [name]: files[0] });
    } else if (name === "player_1_score" || name === "player_2_score") {
      setMatchData((prevData) => ({
        ...prevData,
        result: {
          ...prevData.result,
          [name]: value,
        },
      }));
    } else {
      setMatchData({ ...matchData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(matchData).forEach(key => {
      if (key === "result" && matchData[key]) {
        formData.append(key, JSON.stringify(matchData[key]));  
      } else {
        formData.append(key, matchData[key]);
      }
    });
  
    try {
      const response = await axios.put(`${API_BASE_URL}/matches/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        toast.success("Match mis à jour avec succès !");
      } else {
        toast.error("Échec de la mise à jour de la correspondance.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Quelque chose s'est mal passé.");
    }
  };

  const formatDate = (date) => {
    if (date) {
      const [datePart, timePart] = date.split("T");
      const [year, month, day] = datePart.split("-");
      const [hour, minute] = timePart.split(":");
      return `${year}-${month}-${day}T${hour}:${minute}`;
    }
    return "";
  };

  // Function to get the image URL for preview
  const getImageUrl = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image); // For newly uploaded files
    } else if (typeof image === "string") {
      return `${API_BASE_URL}/${image}`; // For existing images from the server
    }
    return null;
  };

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Modifier la correspondance</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 bg-(--primary) rounded-lg border border-(--border)">
          <div className="grid md:grid-cols-2 gap-3">

            {/* Tournament Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Tournoi</label>
              <select
                name="tournament"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.tournament}
                onChange={handleChange}
              >
                <option value="">Sélectionnez le tournoi</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.tournament_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 1 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Joueur 1</label>
              <select
                name="player_1"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.player_1}
                onChange={handleChange}
              >
                <option value="">Sélectionnez le joueur 1</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Joueur 2</label>
              <select
                name="player_2"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.player_2}
                onChange={handleChange}
              >
                <option value="">Sélectionnez le joueur 2</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.username}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Date et heure</label>
              <input
                type="datetime-local"
                name="date"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={formatDate(matchData.date)}  
                onChange={handleChange}
              />
            </div>
              {/* Status Dropdown */}
              <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Statut</label>
              <select
                name="status"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.status}
                onChange={handleChange}
              >
                <option value="Pending">En attente</option>
                <option value="Completed">Complété</option>
              </select>
            </div>

            {/* Winner Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Gagnant
              </label>
              <select
                name="winner"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.winner || ""}
                onChange={handleChange}
              >
                <option value="">Sélectionnez le gagnant</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Player Scores */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_1)?.username || "Joueur 1"} Score de
              </label>
              <input
                type="number"
                name="player_1_score"
                placeholder="Entrez le score"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.result?.player_1_score || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_2)?.username || "Joueur 2"} Score de
              </label>
              <input
                type="number"
                name="player_2_score"
                placeholder="Entrez le score"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.result?.player_2_score || ""}
                onChange={handleChange}
              />
            </div>

            {/* Player 1 Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_1)?.username || "Joueur 1"} Capture d'écran
              </label>
              <input
                type="file"
                name="player_1_screenshot"
                accept="image/*"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                onChange={handleChange}
              />
              {matchData.result?.player_1_screenshot && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(matchData.result?.player_1_screenshot)}
                    alt="Capture d'écran du joueur 1"
                    className="w-[200px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Player 2 Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_2)?.username || "Joueur 2"} Capture d'écran
              </label>
              <input
                type="file"
                name="player_2_screenshot"
                accept="image/*"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                onChange={handleChange}
              />
              {matchData.result?.player_2_screenshot && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(matchData.result?.player_2_screenshot)}
                    alt="Capture d'écran du joueur 2"
                    className="w-[200px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-(--accent) mt-5 text-white rounded">
          Mettre à jour la correspondance
          </button>
        </form>
      )}
    </>
  );
};

export default EditMatch;