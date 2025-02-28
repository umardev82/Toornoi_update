import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import API_BASE_URL from "../config";


const AddMatch = () => {
  const [matchData, setMatchData] = useState({
    tournament: "",
    player_1: "",
    player_2: "",
    stage: "",
    date: "",
    status: "Pending", // Default status
  });

  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tournaments and players when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentRes, playerRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/tournaments/`),
          axios.get(`${API_BASE_URL}/users/`)
        ]);

        setTournaments(tournamentRes.data);
        setPlayers(playerRes.data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/matches/`, matchData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Match added successfully!");
        setMatchData({ tournament: "", player_1: "", player_2: "", stage: "", date: "", status: "Upcoming" });
      } else {
        toast.error("Failed to add match.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Toaster />
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Add Match</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 bg-(--primary) rounded-lg border border-(--border)">
          <div className="grid md:grid-cols-2 gap-3">
            {/* Tournament Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Tournament</label>
              <select name="tournament" className="w-full bg-(--secondary) text-white p-3 rounded-md" required value={matchData.tournament} onChange={handleChange}>
  <option value="">Select Tournament</option>
  {tournaments.map((tournament) => (
    <option key={tournament.id} value={tournament.id}>{tournament.tournament_name}</option> // <-- Change this!
  ))}
</select>

            </div>

            {/* Player 1 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Player 1</label>
              <select name="player_1" className="w-full bg-(--secondary) text-white p-3 rounded-md" required value={matchData.player_1} onChange={handleChange}>
                <option value="">Select Player 1</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>{player.username}</option>
                ))}
              </select>
            </div>

            {/* Player 2 Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Player 2</label>
              <select name="player_2" className="w-full bg-(--secondary) text-white p-3 rounded-md" required value={matchData.player_2} onChange={handleChange}>
                <option value="">Select Player 2</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>{player.username}</option>
                ))}
              </select>
            </div>
            

            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Date & Time</label>
              <input type="datetime-local" name="date" className="w-full bg-(--secondary) text-white p-3 rounded-md" required value={matchData.date} onChange={handleChange} />
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-(--textwhite)">Status</label>
              <select name="status" className="w-full bg-(--secondary) text-white p-3 rounded-md" value={matchData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-(--accent) mt-5 text-white rounded">Add Match</button>
        </form>
      )}
    </>
  );
};

export default AddMatch;
