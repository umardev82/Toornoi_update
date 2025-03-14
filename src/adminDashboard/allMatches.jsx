import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import * as XLSX from "xlsx";  // Import XLSX for Excel export
import VsImg from "../assets/images/vs.png";
import User1 from "../assets/images/user-1.png";
import User2 from "../assets/images/user-2.png";


const AllMatches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;

const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
const paginatedMatches = filteredMatches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const API_URL = `${API_BASE_URL}/matches/`;

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [searchTerm, selectedTournament, selectedStatus, matches]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMatches(response.data || []);
      setFilteredMatches(response.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Échec de la récupération des correspondances.");
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = () => {
    let filtered = matches.filter((match) =>
      match.tournament?.tournament_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player_2.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTournament !== "All") {
      filtered = filtered.filter((match) => match.tournament?.tournament_name === selectedTournament);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((match) => match.status === selectedStatus);
    }

    setFilteredMatches(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTournamentChange = (event) => {
    setSelectedTournament(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const openViewModal = (match) => {
    setSelectedMatch(match);
    setShowViewModal(true);
  };

  const openDeleteModal = (match) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };

  const handleDeleteMatch = async () => {
    try {
      await axios.delete(`${API_URL}${selectedMatch.id}/`);
      toast.success("Match supprimé avec succès !");
      fetchMatches();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Échec de la suppression de la correspondance.");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredMatches);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matches");
    XLSX.writeFile(workbook, "matches_list.xlsx");
  };

  return (
    <>
      <div className="md:flex-row flex-col flex justify-end mb-4 gap-2 items-start">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher par tournoi ou par joueur"
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />
        <select
          value={selectedTournament}
          onChange={handleTournamentChange}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        >
          <option value="All">Tous les tournois</option>
          {[...new Set(matches.map((match) => match.tournament?.tournament_name))].map((tournament) => (
            <option key={tournament} value={tournament}>{tournament}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        >
          <option value="All">Tous les statuts</option>
          <option value="Pending">En attente</option>
          <option value="Completed">Complété</option>
        </select>
        <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-(--accent) text-white rounded">
        Exporter vers Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="whitespace-nowrap bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium">Tournoi</th>
              <th className="p-3 font-medium">Numéro de pool</th>
              <th className="p-3 font-medium">Joueur 1</th>
              <th className="p-3 font-medium">Joueur 2</th>
              <th className="p-3 font-medium">Statut</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Actes</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4">Loading...</td>
              </tr>
            ) : paginatedMatches.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center font-bold text-white p-4">
                Aucune correspondance trouvée.
                </td>
              </tr>
            ) : (
              paginatedMatches.map((match) => (
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
                  <td className="p-3">
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

      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
          <div className="text-(--textlight) bg-(--primary) p-6 rounded-lg shadow-lg md:w-[70%] w-full h-[80vh] overflow-auto">
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
             <p className="text-(--textlight) mt-1">Date: {selectedMatch.date ? new Date(selectedMatch.date).toLocaleDateString() : "Inconnu"}</p>
             <p className="text-(--textlight)">Localisation: {selectedMatch.tournament?.country || "Inconnu"}</p>
           </div>           
         </div>

         <div className="mt-4 grid grid-cols-2 gap-6">
           <div>
             <p className="text-(--textwhite) font-semibold">Organisateur</p>
             <p className="text-(--textlight)">{selectedMatch.tournament?.sponsorship_details || "Inconnu"}</p>
           </div>
           <div>
             <p className="text-(--textwhite) font-semibold">Arbitre</p>
             <p className="text-(--textlight)">{selectedMatch.admin_username || "Inconnu"}</p>
           </div>
           <div>
             <p className="text-(--textwhite) mb-2 font-semibold">Statut</p>
             <span className={`px-3 py-1 text-sm rounded-4xl ${
               selectedMatch.status === "Pending" ? "bg-[#433E29] text-[#E5BA18]" :
               selectedMatch.status === "Completed" ? "bg-[#003515] text-[#00BB4C]" : "bg-gray-600"
             }`}>
               {selectedMatch.status || "Pending"}
             </span>
           </div>
           <div>
             <p className="text-(--textwhite) font-semibold">Type de correspondance</p>
             <p className="text-(--textlight)">{selectedMatch.tournament?.bracket_type || "Inconnu"}</p>
           </div>
           <div>
             <p className="text-(--textwhite) font-semibold">Pool Number</p>
             <p className="text-(--textlight)">{selectedMatch.pool || "Inconnu"}</p>
           </div>
         </div>

         {/* Match Description */}
         <div className="mt-6">
           <h3 className="text-xl font-bold text-white">À propos</h3>
           <p className="text-(--textlight) mt-2">
             {selectedMatch.tournament?.description || "Aucune information supplémentaire fournie."}
           </p>
         </div>

         {/* Rules & Regulations */}
         <div className="mt-6">
           <h3 className="text-xl font-bold text-white">Règles et règlements</h3>
           <p className="text-(--textlight) mt-2">
             {selectedMatch.tournament?.rules_and_regulations || "Les règles de jeu standard s'appliquent. Veuillez respecter scrupuleusement le règlement du jeu."}
           </p>
         </div>
       </div>
     </div>
            <button className="px-4 py-2 bg-(--accent) text-white rounded mt-4" onClick={() => setShowViewModal(false)}>Fermer</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
          <div className="text-(--textwhite) bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
            <h2 className="text-(--textwhite) mb-4">Confirmer la suppression</h2>
            <p className="text-(--textlight) mb-4">
            Êtes-vous sûr de vouloir supprimer ce match ?
            </p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded mr-4"
              onClick={handleDeleteMatch}
            >
              Oui, supprimer
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllMatches;