import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]); // Ensure this is always an array
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const API_URL = `${API_BASE_URL}/tournaments/`;

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/`);
      console.log("API Response:", response.data); // Debugging log

      // Ensure response is always an array
      if (Array.isArray(response.data)) {
        setTournaments(response.data);
      } else if (typeof response.data === "object") {
        setTournaments([response.data]); // Wrap single object in an array
      } else {
        console.error("Unexpected response format:", response.data);
        setTournaments([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setTournaments([]); // Prevent breaking .map()
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (tournament) => {
    setSelectedTournament(tournament);
    setShowConfirmModal(true);
  };

  // Delete tournament after confirmation
  const deleteTournament = async () => {
    if (!selectedTournament) return;

    const deletePromise = axios.delete(`${API_BASE_URL}/tournaments/${selectedTournament.id}/`);

    toast.promise(deletePromise, {
      loading: "Deleting tournament...",
      success: "Tournament deleted successfully!",
      error: "Failed to delete tournament.",
    });

    try {
      await deletePromise;
      setTournaments(tournaments.filter(t => t.id !== selectedTournament.id));
    } catch (error) {
      console.error("Error deleting tournament:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedTournament(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Tournament</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Description</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Status</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Time</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Date</th>
              <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tournaments || []).map((tournament, index) => (
              <tr key={index} className="bg-(--primary) text-(--textlight)">
                <td className="p-3 flex items-center space-x-3 rounded-r-md whitespace-nowrap w-max">
                  <img
                    src={tournament.cover_image}
                    alt="Tournament"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span>{tournament.tournament_name}</span>
                </td>
                <td className="p-3 truncate max-w-[50px] whitespace-nowrap">{tournament.description}</td>
                <td className="p-3 whitespace-nowrap w-max">
                  <span className="bg-[#433E29] text-[#E5BA18] px-3 pb-1 rounded-full">
                    {tournament.status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap w-max">{tournament.time}</td>
                <td className="p-3 whitespace-nowrap w-max">{tournament.start_date}</td>
                <td className="p-3 whitespace-nowrap w-max">
                  <div className="flex gap-3">
                    <Link to={`/dashboard/view-tournament/${tournament.id}`}>
                      <FaEye className="text-(--accent)" />
                    </Link>
                    <Link to={`/dashboard/edit-tournament/${tournament.id}`}>
                      <FaEdit className="text-yellow-600" />
                    </Link>
                    <MdDelete
                      className="text-red-800 cursor-pointer"
                      onClick={() => confirmDelete(tournament)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Confirmation Modal */}
        {showConfirmModal && selectedTournament && (
          <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
            <div className="bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
              <h2 className="text-(--textwhite) mb-4 lemon-milk-font">Confirm Delete</h2>
              <p className="text-(--textlight) mb-4">
                Are you sure you want to delete the tournament{" "}
                <strong>{selectedTournament.tournament_name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-(--accent) text-(--textwhite) rounded-md"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  onClick={deleteTournament}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TournamentList;
