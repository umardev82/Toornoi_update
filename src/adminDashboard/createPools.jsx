import React, { useState } from "react";
import axios from "axios";
import { useTournament } from "../hooks/useTournament";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";
const CreatePool = () => {
  const { tournaments, loading: tournamentsLoading } = useTournament();
  const [tournamentId, setTournamentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      tournament: tournamentId,
      start_date: startDate,
      end_date: endDate,
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/pools/`, payload);
      
      // Show success message
      toast.success(response.data?.message || "Pool created successfully!", { duration: 5000 });
  
      // Reset form
      setTournamentId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const firstError = Object.values(errorData)?.[0]?.[0] || "An error occurred while creating the pool.";
        
        toast.error(firstError, { duration: 5000 }); // Show error for 5 seconds
      } else {
        toast.error("An unexpected error occurred.", { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <h2 className="lemon-milk-font text-(--textwhite) mb-4">Create Pool</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid md:grid-cols-2 gap-3">
          {/* Tournament Dropdown */}
          <div>
            <label className="text-(--textwhite) min-w-3xs">Tournament:</label>
            <select
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              required
              className="w-full bg-(--secondary) text-white p-3 rounded-md mt-2"
              disabled={tournamentsLoading}
            >
              <option value="">Select Tournament</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.tournament_name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-(--textwhite) min-w-3xs">Start Date:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-(--secondary) text-white p-3 rounded-md mt-2"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-(--textwhite) min-w-3xs">End Date:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full bg-(--secondary) text-white p-3 rounded-md mt-2"
            />
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-(--accent) py-2 px-3 rounded text-(--textwhite)"
        >
          {loading ? "Submitting..." : "Create Pool"}
        </button>
      </form>
    </div>
  );
};

export default CreatePool;
