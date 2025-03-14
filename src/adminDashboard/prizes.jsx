import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import API_BASE_URL from "../config";

const AllPrizes = () => {
  const [prizes, setPrizes] = useState([]);
  const [filteredPrizes, setFilteredPrizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredPrizes.length / itemsPerPage);
  const paginatedPrizes = filteredPrizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    const userToken = localStorage.getItem("adminToken");
    if (!userToken) {
      toast.error("User not authenticated");
      return;
    }
    fetchPrizes(userToken);
  }, []);

  const fetchPrizes = async (userToken) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/prize/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      setPrizes(response.data);
      setFilteredPrizes(response.data);
    } catch (error) {
      toast.error("Failed to load prizes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterPrizes(value, selectedDate);
  };

  const handleDateFilter = (event) => {
    const value = event.target.value;
    setSelectedDate(value);
    filterPrizes(searchTerm, value);
  };

  const filterPrizes = (search, date) => {
    let filtered = prizes.filter(
      (prize) =>
        prize.winner.toLowerCase().includes(search) ||
        prize.tournament.toLowerCase().includes(search) ||
        prize.position.toLowerCase().includes(search)
    );

    if (date) {
      filtered = filtered.filter(
        (prize) => new Date(prize.created_at).toISOString().split("T")[0] === date
      );
    }
    setFilteredPrizes(filtered);
  };

  const openModal = (prize) => {
    setSelectedPrize(prize);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrize(null);
  };

  const confirmDelete = (prize) => {
    setSelectedPrize(prize);
    setShowConfirmModal(true);
  };

  const deletePrize = async () => {
    if (!selectedPrize) return;
    setShowConfirmModal(false);

    let toastId = toast.loading("Deleting prize...");
    try {
      await axios.delete(`${API_BASE_URL}/prize/${selectedPrize.id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` },
      });

      // Update both `prizes` and `filteredPrizes` states
      setPrizes((prevPrizes) => prevPrizes.filter((p) => p.id !== selectedPrize.id));
      setFilteredPrizes((prevFiltered) => prevFiltered.filter((p) => p.id !== selectedPrize.id));

      toast.success("Prix ​​supprimé avec succès !", { id: toastId });
    } catch (error) {
      toast.error("Échec de la suppression du prix", { id: toastId });
    }
  };

  const updatePaymentStatus = async (prizeId, status) => {
    let toastId = toast.loading("Mise à jour du statut de paiement...");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/prize/${prizeId}/update_payment_status/`,
        { status: "paid" },
        {
          headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` },
        }
      );

      if (response.data?.message?.toLowerCase().includes("updated")) {
        toast.success(response.data.message, { id: toastId });

        // Update state immediately
        setPrizes((prevPrizes) =>
          prevPrizes.map((prize) =>
            prize.id === prizeId ? { ...prize, trans_payment_status: "paid" } : prize
          )
        );

        setFilteredPrizes((prevFiltered) =>
          prevFiltered.map((prize) =>
            prize.id === prizeId ? { ...prize, trans_payment_status: "paid" } : prize
          )
        );
      } else {
        toast.error(response.data.message || "Échec de la mise à jour du statut de paiement", { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la mise à jour du statut de paiement", { id: toastId });
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPrizes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prizes");
    XLSX.writeFile(workbook, "prizes_list.xlsx");
  };

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <div className="text-white">
        <div className="flex flex-wrap justify-end gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Rechercher par gagnant, tournoi ou position"
            className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateFilter}
            className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
          />
          <button onClick={exportToExcel} className="px-4 py-2 bg-(--accent) text-white rounded">Exporter vers Excel</button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
              <thead className="bg-(--secondary) p-2 rounded-sm text-white">
                <tr className="rounded-2xl">
                  <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Tournoi</th>
                  <th className="p-3 font-medium whitespace-nowrap w-max">Gagnant</th>
                  <th className="p-3 font-medium whitespace-nowrap w-max">Position</th>
                  <th className="p-3 font-medium whitespace-nowrap w-max">Valeur du prix</th>
                  <th className="p-3 font-medium whitespace-nowrap w-max">Statut de paiement	</th>
                  <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrizes.length > 0 ? (
                  paginatedPrizes.map((prize) => (
                    <tr key={prize.id} className="bg-(--primary) text-(--textlight)">
                      <td className="p-3  whitespace-nowrap">{prize.tournament}</td>
                      <td className="p-3  whitespace-nowrap">{prize.winner}</td>
                      <td className="p-3   whitespace-nowrap">{prize.position}</td>
                      <td className="p-3   whitespace-nowrap">{prize.prize_value}</td>
                      <td className="p-3 whitespace-nowrap">
                        <select
                          value={prize.trans_payment_status}
                          onChange={(e) => updatePaymentStatus(prize.id, e.target.value)}
                          className="bg-(--primary) text-white p-1 rounded"
                        >
                          <option value="pending">En attente
</option>
                          <option value="paid">Payé</option>
                        </select>
                      </td>
                      <td className="p-3 whitespace-nowrap w-max">
                        <div className="flex gap-3">
                          <MdDelete
                            className="text-red-800 cursor-pointer"
                            onClick={() => confirmDelete(prize)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center font-bold text-white p-4">
                    Aucun prix trouvé.
                    </td>
                  </tr>
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

            {showConfirmModal && selectedPrize && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-(--primary) p-6 rounded-lg shadow-lg w-1/3">
                  <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                  <p>Êtes-vous sûr de vouloir supprimer ce prix ?</p>
                  <div className="mt-4 flex justify-end gap-3">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowConfirmModal(false)}>Annuler</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={deletePrize}>
                    Supprimer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AllPrizes;