import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { FaTrophy } from "react-icons/fa";

const PoolDetails = () => {
  const { poolId } = useParams();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const API_URL = `${API_BASE_URL}/pools/${poolId}/`;

  useEffect(() => {
    fetchPoolDetails();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid dates
    return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  const fetchPoolDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setPool(response.data);
    } catch (error) {
      console.error("Error fetching pool details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeMatches = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/pools/${poolId}/finalize-matches/`);
      setPopupMessage(response.data.message || "Matches finalized successfully.");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage(error.response?.data?.error || "An error occurred while finalizing matches.");
      setShowPopup(true);
    }
  };

  if (loading) {
    return <div className="text-center text-white p-4">Loading...</div>;
  }

  if (!pool) {
    return <div className="text-center text-white p-4">Pool not found.</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold  text-white">Pool Details</h2>
        <button 
          className="bg-(--accent) text-white py-2 px-5 rounded"
          onClick={handleFinalizeMatches}
        >
          Finalize Matches
        </button>
      </div>
      <div className="bg-[url('/src/assets/images/header-1.png')] bg-center bg-cover bg-no-repeat rounded-lg md:p-10 px-3 py-6 text-center">
        <div className="bg-white text-black py-2 w-fit mx-auto px-6 rounded-md mb-5">
          <h1 className=""><strong> Pool No:</strong> {pool.pool_number}</h1>
          <h1 className="font-bold"></h1>
          <h1><strong>Total Players:</strong> {pool.total_participants}</h1>
        </div>
        <h1 className="text-white font-bold text-xl mb-3 flex items-center justify-center gap-3">
          <FaTrophy className="text-yellow-600" />{pool.tournament}
        </h1>
        <h1 className="font-bold text-white">
          <span className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
            📅 {pool.start_date ? `${formatDateTime(pool.start_date)}` : "Not Set"}
          </span> - <span className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
            📅 {pool.end_date ? `${formatDateTime(pool.end_date)}` : "Not Set"}
          </span>
        </h1>
      </div>

      <div className="md:flex gap-x-3 mt-5">
        {/* Winner Players Table */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-bold mb-2 text-white">Winner Players</h3>
          <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
            <thead className="bg-(--secondary) p-2 rounded-sm text-white">
              <tr>
                <th className="p-3 font-medium w-[60px]">#</th>
                <th className="p-3 font-medium">Name</th>
              </tr>
            </thead>
            <tbody>
              {(pool.winner_players ?? []).length > 0 ? (
                pool.winner_players.map((player, index) => (
                  <tr key={index} className="bg-(--primary) text-(--textlight)">
                    <td className="p-3 font-medium w-[60px]">{index + 1}</td>
                    <td className="p-3 font-medium">{player}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-2" colSpan="2">No winners</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Loser Players Table */}
        <div className="md:w-1/2 md:mt-0 mt-3">
          <h3 className="text-xl font-bold mb-2 text-white">Loser Players</h3>
          <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
            <thead className="bg-(--secondary) p-2 rounded-sm text-white">
              <tr>
                <th className="p-3 font-medium w-[60px]">#</th>
                <th className="p-3 font-medium">Name</th>
              </tr>
            </thead>
            <tbody>
              {(pool.loser_players ?? []).length > 0 ? (
                pool.loser_players.map((player, index) => (
                  <tr key={index} className="bg-(--primary) text-(--textlight)">
                    <td className="p-3 font-medium w-[60px]">{index + 1}</td>
                    <td className="p-3 font-medium">{player}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-2" colSpan="2">No losers</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for showing messages */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-(--primary) p-5 rounded-lg text-white">
            <p>{popupMessage}</p>
            <button 
              className="mt-4 bg-(--accent) text-white py-2 px-5 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PoolDetails;