import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import VsImg from "../assets/images/vs.png";
import User1 from "../assets/images/user-1.png";
import User2 from "../assets/images/user-2.png";
import { Link } from "react-router-dom";

const AllMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // API Endpoints
  const API_URL = `${API_BASE_URL}/matches/`;

  useEffect(() => {
    fetchMatches();
  }, []);

  // Fetch all matches
  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMatches(response.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to fetch matches.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Modal Handlers
  // -----------------------------

  const openViewModal = (match) => {
    setSelectedMatch(match);
    setShowViewModal(true);
  };

  const openDeleteModal = (match) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };

  // ---------------------------
  // Handle Delete Match
  // ---------------------------
  const handleDeleteMatch = async () => {
    try {
      await axios.delete(`${API_URL}${selectedMatch.id}/`);
      toast.success("Match deleted successfully!");
      fetchMatches();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Failed to delete match.");
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
        <thead className="whitespace-nowrap bg-(--secondary) p-2 rounded-sm text-white">
          <tr className="rounded-2xl">
            <th className="p-3 font-medium">Tournament</th>
            <th className="p-3 font-medium">Pool No</th>
            <th className="p-3 font-medium">Player 1</th>
            <th className="p-3 font-medium">Player 2</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Date</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center p-4">Loading...</td>
            </tr>
          ) : matches.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center font-bold text-white p-4">
                No matches found.
              </td>
            </tr>
          ) : (
            matches.map((match) => (
              <tr key={match.id} className="bg-(--primary) text-(--textlight)">
                <td className="p-3">
                  {match.tournament?.tournament_name}
                </td>
                <td className="p-3">
                  {match.pool}
                </td>
                <td className="p-3">
                  {match.player_1}
                </td>
                <td className="p-3">
                  {match.player_2}
                </td>
                <td className="p-3" 
>
  <span className={`whitespace-nowrap p-2 pt-1 text-sm rounded ${
    match.status === "Completed" ? "text-green-400 bg-green-900" : "bg-[#433E29] text-[#E5BA18]"
  }`}>
  {match.status}
  </span>
  
</td>

                <td className="p-3">
                  {match.date ? new Date(match.date).toLocaleDateString() : ""}
                </td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => openViewModal(match)}>
                    <FaEye className="text-(--accent)" />
                  </button>

                  {/* Edit button now links to the edit page */}
                  <Link to={`/dashboard/edit-match/${match.id}`}>
                    <FaEdit className="text-yellow-600" />
                  </Link>

                  <button onClick={() => openDeleteModal(match)}>
                    <MdDelete className="text-red-800" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
          {/* Modal content for viewing match */}
          <div className="text-(--textlight) bg-(--primary) p-6 rounded-lg shadow-lg md:w-[70%] w-full h-[80vh] overflow-auto">
             {/* Header Section */}
      <div>
       
        {/* Match Banner */}
        <div className="bg-[url('/src/assets/images/header-1.png')] bg-center bg-cover bg-no-repeat rounded-lg p-10 text-center">
          <div className="bg-white text-black py-1 w-fit mx-auto px-6 rounded-md mb-5">
            <h1 className="">Score</h1>
            <h1 className="font-bold">{selectedMatch.result?.player_1_score ?? "0"}-{selectedMatch.result?.player_2_score ?? "0"}</h1>
          </div>
          <div className="flex justify-center gap-3 items-center">
            <div className="flex flex-col items-center">
              <img src={selectedMatch.player_1_photo || User1} alt="Player 1" className="w-20 h-20 object-cover rounded-2xl" />
              <p className="text-lg font-semibold">{selectedMatch.player_1 || "Player 1"}</p>
            </div>
            <div>
              <img src={VsImg} alt="" />
            </div>
            <div className="flex flex-col items-center">
              <img src={selectedMatch.player_2_photo || User2} alt="Player 2" className="w-20 h-20 object-cover rounded-2xl" />
              <p className="text-lg font-semibold">{selectedMatch.player_2 || "Player 2"}</p>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="mt-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white"><span className="capitalize">{selectedMatch.player_1} </span>vs <span className="capitalize">{selectedMatch.player_2}</span></h2>
              <p className="text-(--textlight) mt-1">Date: {selectedMatch.date ? new Date(selectedMatch.date).toLocaleDateString() : "TBD"}</p>
              <p className="text-(--textlight)">Location: {selectedMatch.tournament?.country || "Unknown"}</p>
            </div>           
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <p className="text-(--textwhite) font-semibold">Organizer</p>
              <p className="text-(--textlight)">{selectedMatch.tournament?.sponsorship_details || "Unknown"}</p>
            </div>
            <div>
              <p className="text-(--textwhite) font-semibold">Referee</p>
              <p className="text-(--textlight)">{selectedMatch.admin_username || "Unknown"}</p>
            </div>
            <div>
              <p className="text-(--textwhite) mb-2 font-semibold">Status</p>
              <span className={`px-3 py-1 text-sm rounded-4xl ${
                selectedMatch.status === "Pending" ? "bg-[#433E29] text-[#E5BA18]" :
                selectedMatch.status === "Completed" ? "bg-[#003515] text-[#00BB4C]" : "bg-gray-600"
              }`}>
                {selectedMatch.status || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-(--textwhite) font-semibold">Match Type</p>
              <p className="text-(--textlight)">{selectedMatch.tournament?.bracket_type || "Unknown"}</p>
            </div>
            <div>
              <p className="text-(--textwhite) font-semibold">Pool No</p>
              <p className="text-(--textlight)">{selectedMatch.pool || "Unknown"}</p>
            </div>
          </div>

          {/* Match Description */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white">About</h3>
            <p className="text-(--textlight) mt-2">
              {selectedMatch.tournament?.description || "No additional information provided."}
            </p>
          </div>

          {/* Rules & Regulations */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white">Rules and Regulations</h3>
            <p className="text-(--textlight) mt-2">
              {selectedMatch.tournament?.rules_and_regulations || "Standard match rules apply. Please follow the game regulations strictly."}
            </p>
          </div>
        </div>
      </div>
            <button className="px-4 py-2 bg-(--accent) text-white rounded mt-4" onClick={() => setShowViewModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
          {/* Modal content for confirming deletion */}
          <div className="text-(--textwhite) bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
          <h2 className="text-(--textwhite) mb-4 lemon-milk-font">Confirm Delete</h2>
            <p className="text-(--textlight) mb-4">
              Are you sure you want to delete this match?
            </p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded mr-4"
              onClick={handleDeleteMatch}
            >
              Yes, Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMatches;
