import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
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
                  {typeof match.tournament === "object"
                    ? match.tournament.name
                    : match.tournament}
                </td>
                <td className="p-3">
                  {typeof match.player_1 === "object"
                    ? match.player_1.username
                    : match.player_1}
                </td>
                <td className="p-3">
                  {typeof match.player_2 === "object"
                    ? match.player_2.username
                    : match.player_2}
                </td>
                <td className="p-3">{match.status}</td>
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
          <div className="text-(--textlight) bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
            <h2 className="text-(--textwhite) mb-4 lemon-milk-font">Match Details</h2>
            <p><strong>Tournament:</strong> {selectedMatch.tournament}</p>
            <p><strong>Player 1:</strong> {selectedMatch.player_1}</p>
            <p><strong>Player 2:</strong> {selectedMatch.player_2}</p>
            <p><strong>Status:</strong> {selectedMatch.status}</p>
            <p><strong>Date:</strong> {new Date(selectedMatch.date).toLocaleString()}</p>
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
