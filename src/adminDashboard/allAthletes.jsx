import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";  // Import XLSX for Excel export

import API_BASE_URL from "../config";

const AllAthletes = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredUsers = users.filter((user) => {
    return (
      (verifiedFilter === "all" || user.is_verified === (verifiedFilter === "verified")) &&
      (activeFilter === "all" || user.is_active === (activeFilter === "active")) &&
      (searchQuery === "" || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const API_URL = `${API_BASE_URL}/users/`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users); // Convert JSON data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Athletes");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "athletes_list.xlsx");
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    setShowConfirmModal(false);

    try {
      await axios.delete(`${API_URL}${selectedUser.id}/`);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      toast.success("Utilisateur supprimé avec succès !");
    } catch (error) {
      toast.error("Échec de la suppression de l'utilisateur.");
    }
  };

  return (
    
       <div >
      
      <div className="flex flex-wrap md:justify-end gap-3 mb-4 items-start">
      
        <input 
          type="text" 
          placeholder="Rechercher par nom d'utilisateur" 
          className="md:w-auto w-full border border-(--border) p-2  rounded text-white bg-(--primary)" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <select className="md:w-auto  w-full border border-(--border) p-2 rounded text-white bg-(--primary)" value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}>
          <option value="all">Tout</option>
          <option value="verified">Vérifié</option>
          <option value="not_verified">Non vérifié</option>
        </select>
        <select className="md:w-auto  w-full border border-(--border) p-2 rounded text-white bg-(--primary)" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="all">Tout</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
       
        <button 
        onClick={exportToExcel} 
        className="mb-4 px-4 py-2 bg-(--accent) text-white rounded"
      >
        Exporter vers Excel
      </button>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full table-auto text-left whitespace-nowrap text-white border-separate border-spacing-y-2 border border-transparent">
        <thead className="bg-(--secondary) p-2 rounded-sm text-white">
          <tr>
            <th className="p-3 font-medium rounded-l-md">Nom d'utilisateur</th>
            <th className="p-3 font-medium">E-mail</th>
            <th className="p-3 font-medium">Téléphone</th>
            <th className="p-3 font-medium">Vérifié</th>
            <th className="p-3 font-medium">Actif</th>
            <th className="p-3 font-medium rounded-r-md">Actes</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center p-4">Loading...</td>
            </tr>
          ) : paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">Aucun utilisateur trouvé.</td>
            </tr>
          ) : (
            paginatedUsers.map((user) => (
              <tr key={user.id} className="bg-(--primary) text-white">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone_number}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${user.is_verified ? "text-white bg-green-900" : "text-white bg-red-900"}`}>
                    {user.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${user.is_active ? "text-white bg-green-900" : "text-white bg-red-900"}`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
                  <FaEye className="text-blue-400 cursor-pointer" onClick={() => { setSelectedUser(user); setShowViewModal(true); }} />
                  <a href={`/dashboard/edit-athlete/${user.id}`}>
                    <FaEdit className="text-yellow-400" />
                  </a>
                  <MdDelete className="text-red-600 cursor-pointer" onClick={() => { setSelectedUser(user); setShowConfirmModal(true); }} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>  </div>
            {/* View Athlete Modal */}
            {showViewModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-5 z-50">
          <div className="bg-(--primary) p-6 rounded-lg shadow-lg w-96">
            <h1 className="text-white lemon-milk-font mb-4">Détails de l'athlète</h1>
            <div className="text-(--textlight) space-y-2">
              <p>
                <strong className="text-white">Nom d'utilisateur:</strong> {selectedUser.username}
              </p>
              <p>
                <strong className="text-white">Prénom:</strong> {selectedUser.first_name}
              </p>
              <p>
                <strong className="text-white">Nom de famille:</strong> {selectedUser.last_name}
              </p>
              <p>
                <strong className="text-white">E-mail:</strong> {selectedUser.email}
              </p>
              <p>
                <strong className="text-white">Numéro de téléphone :</strong> {selectedUser.phone_number}
              </p>
              <p>
                <strong className="text-white">Date de naissance :</strong> {selectedUser.date_of_birth}
              </p>
              <p>
                <strong className="text-white">Vérifié:</strong>{" "}
                <span className={selectedUser.is_verified ? "text-green-500" : "text-red-500"}>
                  {selectedUser.is_verified ? "Oui" : "Non"}
                </span>
              </p>
              <p>
                <strong className="text-white">Actif :</strong>{" "}
                <span className={selectedUser.is_active ? "text-green-500" : "text-red-500"}>
                  {selectedUser.is_active ? "Oui" : "Non"}
                </span>
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-(--accent) text-white rounded-md"
                onClick={() => setShowViewModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-5 z-50">
          <div className="bg-(--primary) p-6 rounded-lg shadow-lg w-96">
            <h1 className="text-white lemon-milk-font mb-4">Confirmer la suppression</h1>
            <p className="text-(--textlight) mb-4">
            Êtes-vous sûr de vouloir supprimer <strong>{selectedUser.username}</strong>? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-(--accent) text-white rounded-md" onClick={() => setShowConfirmModal(false)}>
              Annuler
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={deleteUser}>
              Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
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
      {/* Rest of your JSX remains the same */}
    </div>
  );
};

export default AllAthletes;