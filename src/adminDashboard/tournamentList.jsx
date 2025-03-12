import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";  // Import XLSX for Excel export
import API_BASE_URL from "../config";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state
  const API_URL = `${API_BASE_URL}/tournaments/`;

  // 🔹 New state variables for filters and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔹 Filtered tournaments based on search and status
  const [filteredTournaments, setFilteredTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        setTournaments(response.data);
        setFilteredTournaments(response.data); // Initialize filtered tournaments
      } else if (typeof response.data === "object") {
        setTournaments([response.data]);
        setFilteredTournaments([response.data]);
      } else {
        setTournaments([]);
        setFilteredTournaments([]);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setTournaments([]);
      setFilteredTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter logic
  useEffect(() => {
    let filteredData = tournaments.filter((tournament) => {
      return (
        (search === "" || tournament.tournament_name.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "" || tournament.status === statusFilter)
      );
    });

    setFilteredTournaments(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  }, [search, statusFilter, tournaments]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tournaments); // Convert JSON data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tournaments");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "tournaments_list.xlsx");
  };

  // 🔹 Pagination logic
 

  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const paginatedTournaments = filteredTournaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid dates
    return date.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
  };

  const formatOnlyTime = (timeString) => {
    const [hours, minutes] = timeString.split(":"); // Extract HH and MM
    if (!hours || !minutes) return "Invalid Time"; // Handle invalid input
    return `${hours}:${minutes}`; // Format as HH:MM
  };

  const confirmDelete = (tournament) => {
    setSelectedTournament(tournament);
    setShowConfirmModal(true);
  };

  const deleteTournament = async () => {
    if (!selectedTournament) return;
    setShowConfirmModal(false);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(`${API_URL}${selectedTournament.id}/`);
        setTournaments((prev) =>
          prev.filter((t) => t.id !== selectedTournament.id)
        );
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        setSelectedTournament(null);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting tournament...",
      success: "Tournament deleted successfully!",
      error: "Failed to delete tournament.",
    });
  };

  return (
    <div>
      {/* 🔹 Search & Filter Section */}
      <div className="flex flex-wrap md:justify-end items-start gap-3 mb-4">
        <input
          type="text"
          placeholder="Search tournament..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>

        <button 
        onClick={exportToExcel} 
        className="mb-4 px-4 py-2 bg-(--accent) text-white rounded"
      >
        Export to Excel
      </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Tournament</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Registration Fee</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Status</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Slots</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Date</th>
              <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  <div className="w-full flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedTournaments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center font-bold text-white p-4">
                  No tournaments found.
                </td>
              </tr>
            ) : (
              paginatedTournaments.map((tournament, index) => (
                <tr key={index} className="bg-(--primary) text-(--textlight)">
                  <td className="p-3 flex items-center space-x-3 rounded-r-md whitespace-nowrap w-max">
                    <img
                      src={tournament.cover_image}
                      alt="Tournament"
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span>{tournament.tournament_name}</span>
                  </td>
                  <td className="p-3 truncate max-w-[50px] whitespace-nowrap">{tournament.registration_fee}€</td>
                  <td className="p-3 whitespace-nowrap w-max">
                    <span className="bg-[#433E29] text-[#E5BA18] px-3 pb-1 rounded-full">
                      {tournament.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap w-max">{tournament.slots || "Not Set"}</td>
                  <td className="p-3 whitespace-nowrap w-max">
                    {tournament.start_date && tournament.end_date
                      ? `${formatDate(tournament.start_date)} - ${formatDate(tournament.end_date)}`
                      : "Not Set"}
                  </td>
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
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (   
   <div className="flex items-center justify-center mt-6 space-x-4">
     <button
       onClick={handlePrevPage}
       disabled={currentPage === 1}
       className="py-1 px-3 bg-(--primary) text-white rounded disabled:opacity-50"
     >
       Previous
     </button>
     <span className="text-(--accent) font-bold">{currentPage} / {totalPages}</span>
     <button
       onClick={handleNextPage}
       disabled={currentPage === totalPages}
       className="py-1 px-3 bg-(--primary) text-white rounded disabled:opacity-50"
     >
       Next
     </button>
   </div>
)}

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
    </div>
  );
};

export default TournamentList;