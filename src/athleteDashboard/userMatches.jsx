import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";

const UserMatches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/user/matches/my_matches/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMatches(response.data);
      setFilteredMatches(response.data);
      extractStatuses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const extractStatuses = (data) => {
    const uniqueStatuses = [...new Set(data.map((match) => match.status))];
    setStatuses(uniqueStatuses);
  };

  useEffect(() => {
    setLoading(true);
    let filteredData = matches.filter((match) => {
      return (
        (search === "" || match.tournament?.tournament_name.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "" || match.status === statusFilter)
      );
    });
  
    setTimeout(() => {
      setFilteredMatches(filteredData);
      setCurrentPage(1); // Reset pagination when filters change
      setLoading(false);
    }, 500);
  }, [search, statusFilter, matches]);
  

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const paginatedMatches = filteredMatches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const getStatusClass = (status) => {
    return status === "Completed"
      ? "text-green-400 bg-green-900"
      : status === "Pending"
      ? "bg-[#433E29] text-[#E5BA18]"
      : "bg-gray-500 text-white";
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher une correspondance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-(--border) p-2 rounded text-white md:w-auto w-full bg-(--primary)"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-(--border) p-2 rounded text-white md:w-auto w-full bg-(--primary)"
        >
          <option value="">Tous les statuts</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium whitespace-nowrap">Tournoi</th>
              <th className="p-3 font-medium whitespace-nowrap">Joueur 1</th>
              <th className="p-3 font-medium whitespace-nowrap">Joueur 2</th>
              <th className="p-3 font-medium whitespace-nowrap">Date</th>
              <th className="p-3 font-medium whitespace-nowrap">Statut</th>
              <th className="p-3 font-medium whitespace-nowrap">Actes</th>
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
            ) : paginatedMatches.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center font-bold text-white p-4">Aucune correspondance trouvée.</td>
              </tr>
            ) : (
              paginatedMatches.map((match) => (
                <tr key={match.id} className="bg-(--primary) text-white">
                  <td className="p-3 whitespace-nowrap">{match.tournament?.tournament_name || "En attente"}</td>
                  <td className="p-3 whitespace-nowrap">{match.player_1 || "En attente"}</td>
                  <td className="p-3 whitespace-nowrap">{match.player_2 || "En attente"}</td>
                  <td className="p-3 whitespace-nowrap">
                    {match.date ? new Date(match.date).toLocaleString("en-GB") : "En attente"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`whitespace-nowrap p-2 pt-1 text-sm rounded ${getStatusClass(match.status)}`}>
                      {match.status || "En attente"}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Link to={`/my-account/match/${match.id}`} className="px-3 py-1 bg-(--accent) text-white rounded">Voir</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (   
  <div className="flex items-center justify-center mt-6 space-x-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="py-1 px-3 bg-(--primary) text-white rounded disabled:opacity-50"
    >
      Précédent
    </button>
    <span className="text-(--accent) font-bold">{currentPage} / {totalPages}</span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="py-1 px-3 bg-(--primary) text-white rounded disabled:opacity-50"
    >
      Suivant
    </button>
  </div>

)}
    </>
  );
};

export default UserMatches;
