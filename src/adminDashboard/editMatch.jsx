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
          axios.get(`${API_BASE_URL}/matches/${id}/`)
        ]);

        setTournaments(tournamentRes.data);
        setPlayers(playerRes.data);
        if (matchRes.data) {
          setMatchData(matchRes.data);  
        }
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      toast.error("Match ID is missing.");
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
        toast.success("Match updated successfully!");
      } else {
        toast.error("Failed to update match.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
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
      <Toaster />
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Edit Match</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 bg-(--primary) rounded-lg border border-(--border)">
          <div className="grid md:grid-cols-2 gap-3">

            {/* Tournament Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Tournament</label>
              <select
                name="tournament"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.tournament}
                onChange={handleChange}
              >
                <option value="">Select Tournament</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.tournament_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 1 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Player 1</label>
              <select
                name="player_1"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.player_1}
                onChange={handleChange}
              >
                <option value="">Select Player 1</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Player 2 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Player 2</label>
              <select
                name="player_2"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
                value={matchData.player_2}
                onChange={handleChange}
              >
                <option value="">Select Player 2</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.username}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Date & Time</label>
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
              <label className="text-(--textwhite)">Status</label>
              <select
                name="status"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Winner Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Winner</label>
              <select
                name="winner"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.winner || ""}
                onChange={handleChange}
              >
                <option value="">Select Winner</option>
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
                {players.find(p => p.id === matchData.player_1)?.username || "Player 1"} Score
              </label>
              <input
                type="number"
                name="player_1_score"
                placeholder="Enter Score"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.result?.player_1_score || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_2)?.username || "Player 2"} Score
              </label>
              <input
                type="number"
                name="player_2_score"
                placeholder="Enter Score"
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                value={matchData.result?.player_2_score || ""}
                onChange={handleChange}
              />
            </div>

            {/* Player 1 Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_1)?.username || "Player 1"} Screenshot
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
                    alt="Player 1 Screenshot"
                    className="w-[200px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Player 2 Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">
                {players.find(p => p.id === matchData.player_2)?.username || "Player 2"} Screenshot
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
                    alt="Player 2 Screenshot"
                    className="w-[200px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-(--accent) mt-5 text-white rounded">
            Update Match
          </button>
        </form>
      )}
    </>
  );
};

export default EditMatch;