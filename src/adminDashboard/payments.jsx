import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";
import * as XLSX from "xlsx";

const Payments = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API_URL = `${API_BASE_URL}/register_athletes_tournament/`;

  useEffect(() => {
    fetchRegistrations();
    fetchTournaments();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setRegistrations(response.data);
      setFilteredRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = registrations.filter(
      (item) =>
        item.username.toLowerCase().includes(value) ||
        item.tournament_name.toLowerCase().includes(value) ||
        item.payment_status.toLowerCase().includes(value)
    );

    setFilteredRegistrations(filtered);
    setCurrentPage(1); // Reset pagination when filters change
  };

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/`);
      setTournaments(response.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleTournamentFilter = (event) => {
    const selectedValue = event.target.value;
    setSelectedTournament(selectedValue);

    if (selectedValue === "") {
      setFilteredRegistrations(registrations);
    } else {
      setFilteredRegistrations(
        registrations.filter((item) => item.tournament_name === selectedValue)
      );
    }
    setCurrentPage(1); // Reset pagination when filters change
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id);
    const updateToast = toast.loading("Mise à jour du statut...");

    try {
      await axios.patch(`${API_URL}${id}/`, { payment_status: newStatus });

      setFilteredRegistrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, payment_status: newStatus } : item
        )
      );

      toast.success("Statut de paiement mis à jour !", { id: updateToast });
    } catch (error) {
      toast.error("Échec de la mise à jour du statut.", { id: updateToast });
    } finally {
      setLoadingId(null);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments_list.xlsx");
  };

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <div className="flex flex-wrap justify-end gap-2 items-start">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher par nom d'utilisateur, tournoi ou statut"
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />
        <select
          value={selectedTournament}
          onChange={handleTournamentFilter}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        >
          <option value="">Tous les tournois</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.tournament_name}>
              {tournament.tournament_name}
            </option>
          ))}
        </select>
        <button
          onClick={exportToExcel}
          className="mb-4 px-4 py-2 bg-(--accent) text-white rounded text-nowrap"
        >
          Exporter vers Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
            <thead className="bg-(--secondary) p-2 rounded-sm text-white">
              <tr className="rounded-2xl">
                <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Nom d'utilisateur</th>
                <th className="p-3 font-medium  whitespace-nowrap w-max">E-mail	</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Tournoi</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Enregistré à</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Statut de paiement</th>
                <th className="p-3 font-medium whitespace-nowrap w-max rounded-r-md">Montant</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center font-bold text-white p-4">
                  Aucune inscription trouvée.
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((item) => (
                  <tr key={item.id} className="bg-(--primary) text-(--textlight)">
                    <td className="p-3 whitespace-nowrap">{item.username}</td>
                    <td className="p-3 whitespace-nowrap">{item.email}</td>
                    <td className="p-3 whitespace-nowrap">{item.tournament_name}</td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("en-GB")}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="bg-green-900 rounded text-white text-sm py-1 px-4">{item.payment_status}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{item.amount} €</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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

export default Payments;