import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import * as XLSX from "xlsx";  // Import XLSX for Excel export

const PoolList = () => {
  const [pools, setPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("All");
  const API_URL = `${API_BASE_URL}/pools/`;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredPools.length / itemsPerPage);
  const paginatedPools = filteredPools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    fetchPools();
  }, []);

  useEffect(() => {
    filterPools();
  }, [searchTerm, selectedTournament, pools]);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        setPools(response.data);
        setFilteredPools(response.data);
      } else {
        setPools([]);
        setFilteredPools([]);
      }
    } catch (error) {
      console.error("Error fetching pools:", error);
      setPools([]);
      setFilteredPools([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPools = () => {
    let filtered = pools.filter((pool) =>
      pool.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.pool_number.toString().includes(searchTerm)
    );
    if (selectedTournament !== "All") {
      filtered = filtered.filter((pool) => pool.tournament === selectedTournament);
    }
    setFilteredPools(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTournamentChange = (event) => {
    setSelectedTournament(event.target.value);
  };

  const confirmDelete = (pool) => {
    setSelectedPool(pool);
    setShowConfirmModal(true);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date)) return "Invalid Date";
    return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPools);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pools");
    XLSX.writeFile(workbook, "pools_list.xlsx");
  };

  const deletePool = async () => {
    if (!selectedPool) return;
    setShowConfirmModal(false);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(`${API_URL}${selectedPool.id}/`);
        setPools((prev) => prev.filter((p) => p.id !== selectedPool.id));
        setFilteredPools((prev) => prev.filter((p) => p.id !== selectedPool.id));
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        setSelectedPool(null);
      }
    });

    toast.promise(deletePromise, {
      loading: "Suppression du pool...",
      success: "Pool supprimé avec succès !",
      error: "Échec de la suppression du pool.",
    });
  };

  return (
    <>
      <div className="flex flex-wrap  justify-end mb-4 gap-2 items-start">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher par numéro de tournoi ou de poule"
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        >
          <option value="All">Tous les tournois</option>
          {[...new Set(pools.map((pool) => pool.tournament))].map((tournament) => (
            <option key={tournament} value={tournament}>{tournament}</option>
          ))}
        </select>
        <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-(--accent) text-white rounded">
        Exporter vers Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr>
              <th className="p-3 font-medium">Tournoi</th>
              <th className="p-3 font-medium">Numéro de piscine</th>
              <th className="p-3 font-medium">Date de début</th>
              <th className="p-3 font-medium">Nombre total de joueurs</th> {/* New Column */}
              <th className="p-3 font-medium">Actes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">Loading...</td>
              </tr>
            ) : filteredPools.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center font-bold text-white p-4">Aucune piscine trouvée.</td>
              </tr>
            ) : (
              paginatedPools.map((pool) => (
                <tr key={pool.id} className="bg-(--primary) text-(--textlight)">
                  <td className="p-3">{pool.tournament}</td>
                  <td className="p-3">{pool.pool_number}</td>
                  <td className="p-3">{pool.start_date ? formatDateTime(pool.start_date) : "Non défini"}</td>
                  <td className="p-3">{pool.all_players ? pool.all_players.length : 0}</td> {/* Display Total Players */}
                  <td className="p-3">
                    <div className="flex gap-3">
                      <Link to={`/dashboard/pools/${pool.id}`}>
                        <FaEye className="text-(--accent)" />
                      </Link>
                      <MdDelete
                        className="text-red-600 cursor-pointer"
                        onClick={() => confirmDelete(pool)}
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
              Précédent
            </button>
            <span className="text-(--accent) font-bold">{currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="py-1 px-3 bg-(--primary) text-white rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}

        {showConfirmModal && selectedPool && (
          <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
            <div className="bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
              <h2 className="text-(--textwhite) mb-4">Confirmer la suppression</h2>
              <p className="text-(--textlight) mb-4">
              Êtes-vous sûr de vouloir supprimer le pool pour le tournoi <strong>{selectedPool.tournament_name}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-(--accent) text-(--textwhite) rounded-md" onClick={() => setShowConfirmModal(false)}>
                Annuler
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={deletePool}>
                  
                Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PoolList;