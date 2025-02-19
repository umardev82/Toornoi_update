import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const UserMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("userToken");  
      console.log("Token being sent:", token);  
  
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/user/matches/`, {
        headers: {
          Authorization: `Token ${token}`,  
          "Content-Type": "application/json",
        },
      });
  
      console.log("API Response:", response.data);
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status === "Completed" ? "text-green-400 bg-green-900" : status === "Pending" ? "bg-[#433E29] text-[#E5BA18]" : "bg-gray-500 text-white";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
        <thead className="bg-(--secondary) p-2 rounded-sm text-white">
          <tr className="rounded-2xl">
            <th className="p-3 font-medium whitespace-nowrap">Stage</th>
            <th className="p-3 font-medium whitespace-nowrap">Tournament</th>        
            <th className="p-3 font-medium whitespace-nowrap">Date</th>
            <th className="p-3 font-medium whitespace-nowrap">Status</th>
            <th className="p-3 font-medium whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                <div className="w-full flex justify-center items-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
              </td>
            </tr>
          ) : matches.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center font-bold text-white p-4">No matches found.</td>
            </tr>
          ) : (
            matches.map((match) => (
              <tr key={match.id} className="bg-(--primary) text-white">
                <td className="p-3 whitespace-nowrap">{match.stage || "Pending"}</td>
                <td className="p-3 whitespace-nowrap">{match.tournament || "Pending"}</td>
                <td className="p-3 whitespace-nowrap">{match.date ? new Date(match.date).toLocaleString("en-GB") : "Pending"}</td>
                <td className="p-3 whitespace-nowrap ">
               <span className={` whitespace-nowrap p-2 pt-1 text-sm rounded ${getStatusClass(match.status)}`}>{match.status || "Pending"}</span>   
                </td>
                <td className="p-3 whitespace-nowrap">
                  <button
                    className="px-3 py-1 bg-(--accent) text-white rounded "
                    onClick={() => setSelectedMatch(match)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Viewing Details */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/70 z-500 flex justify-center items-center p-5">
          <div className="bg-(--primary) text-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Match Details</h2>
            <p><strong>Stage:</strong> {selectedMatch.stage || "Pending"}</p>
            <p><strong>Tournament:</strong> {selectedMatch.tournament || "Pending"}</p>
            <p><strong>Date:</strong> {selectedMatch.date ? new Date(selectedMatch.date).toLocaleString("en-GB") : "Pending"}</p>
            <p><strong>Player 1:</strong> {selectedMatch.player_1 || "Pending"}</p>
            <p><strong>Player 2:</strong> {selectedMatch.player_2 || "Pending"}</p>
            <p><strong>Status:</strong> {selectedMatch.status || "Pending"}</p>
            <p><strong>Winner:</strong> {selectedMatch.winner || "Pending"}</p>
            <p><strong>Result:</strong> {selectedMatch.result || "Pending"}</p>
    
{selectedMatch.screenshot ? (
  <a href={`${API_BASE_URL}${selectedMatch.screenshot}`} target="_blank" rel="noopener noreferrer">
    <img 
      src={`${API_BASE_URL}${selectedMatch.screenshot}`} 
      alt="Match Screenshot" 
      className="w-[200px] cursor-pointer"
    />
  </a>
) : (
  <p><strong>Screenshot:</strong> Pending</p>
)}


           
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-600" onClick={() => setSelectedMatch(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMatches;
