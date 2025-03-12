import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import API_BASE_URL from "../config";

const AllClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const paginatedClaims = filteredClaims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    const userToken = localStorage.getItem("adminToken");
    if (!userToken) {
      toast.error("User not authenticated");
      return;
    }
    fetchClaims(userToken);
  }, []);

  const fetchClaims = async (userToken) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/claims/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      setClaims(response.data);
      setFilteredClaims(response.data);
    } catch (error) {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterClaims(value, selectedDate);
  };

  const handleDateFilter = (event) => {
    const value = event.target.value;
    setSelectedDate(value);
    filterClaims(searchTerm, value);
  };

  const filterClaims = (search, date) => {
    let filtered = claims.filter(
      (claim) =>
        claim.user.toLowerCase().includes(search) ||
        claim.phone_number.includes(search) ||
        claim.subject.toLowerCase().includes(search)
    );

    if (date) {
      filtered = filtered.filter(
        (claim) => new Date(claim.created_at).toISOString().split("T")[0] === date
      );
    }
    setFilteredClaims(filtered);
  };

  const openModal = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  const confirmDelete = (claim) => {
    setSelectedClaim(claim);
    setShowConfirmModal(true);
  };

  const deleteClaim = async () => {
    if (!selectedClaim) return;
    setShowConfirmModal(false);
    try {
      await axios.delete(`${API_BASE_URL}/claims/${selectedClaim.id}/`);
      setClaims(claims.filter((c) => c.id !== selectedClaim.id));
      setFilteredClaims(filteredClaims.filter((c) => c.id !== selectedClaim.id));
      toast.success("Support ticket deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete support ticket");
    }
  };

 
  const updateClaimStatus = async (claimId, status) => {
    let toastId = toast.loading("Updating claim status...");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/claims/${claimId}/update-claim-status/`,
        { status },
        {
          headers: { Authorization: `Token ${localStorage.getItem("adminToken")}` },
        }
      );
  
      console.log(response.data); // Debugging
  
      // Check message content to determine success or error
      const message = response.data.message || "Claim status updated!";
      
      if (message.toLowerCase().includes("success")) {
        toast.success(message,  { id: toastId });
        
        // Update state
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim.id === claimId ? { ...claim, claim_status: status } : claim
          )
        );
  
        setFilteredClaims((prevFiltered) =>
          prevFiltered.map((claim) =>
            claim.id === claimId ? { ...claim, claim_status: status } : claim
          )
        );
      } else {
        toast.error(message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update claim status", { id: toastId });
    }
  };
  
  
  


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredClaims);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Support-Tickets");
    XLSX.writeFile(workbook, "support_tickets_list.xlsx");
  };

  return (
    <>
    {/* <Toaster toastOptions={{ duration: 5000 }} /> */}

    <div className="text-white">
      <div className="md:flex justify-end gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by user, phone, or subject"
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilter}
          className="md:w-auto w-full border border-(--border) p-2 rounded text-white bg-(--primary)"
        />
        <button onClick={exportToExcel} className="px-4 py-2 bg-(--accent) text-white rounded">Export to Excel</button>
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
                <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">User</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Phone</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Subject</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Details</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Status</th>
                <th className="p-3 font-medium whitespace-nowrap w-max">Date</th>
                <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClaims.length > 0 ? (
                paginatedClaims.map((claim) => (
                  <tr key={claim.id} className="bg-(--primary) text-(--textlight)">
                    <td className="p-3 max-w-[80px] whitespace-nowrap">{claim.user}</td>
                    <td className="p-3 max-w-[80px] whitespace-nowrap">{claim.phone_number}</td>
                    <td className="p-3 truncate max-w-[50px] whitespace-nowrap">{claim.subject}</td>
                    <td className="p-3 truncate max-w-[50px] whitespace-nowrap">{claim.details}</td>
                    <td className="p-3 whitespace-nowrap">
                    
                    <select
                   value={claim.claim_status} // Use updated claim_status
                    onChange={(e) => updateClaimStatus(claim.id, e.target.value)}
                   className="bg-(--primary) text-white p-1 rounded"
>
  <option value="Pending">Pending</option>
  <option value="Resolved">Resolved</option>
</select>

                    </td>
                    <td className="p-3 whitespace-nowrap">{new Date(claim.created_at).toLocaleString()}</td>
                    <td className="p-3 whitespace-nowrap w-max">
                      <div className="flex gap-3">
                        <Link>
                          <FaEye className="text-(--accent)" onClick={() => openModal(claim)} />
                        </Link>
                        <MdDelete
                          className="text-red-800 cursor-pointer"
                          onClick={() => confirmDelete(claim)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center font-bold text-white p-4">
                    No support tickets found.
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

          {showModal && selectedClaim && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-(--primary) p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Support Ticket Details</h2>
                <p><strong>User:</strong> {selectedClaim.user}</p>
                <p><strong>Phone:</strong> {selectedClaim.phone_number}</p>
                <p><strong>Subject:</strong> {selectedClaim.subject}</p>
                <p><strong>Details:</strong> {selectedClaim.details}</p>
                <p><strong>Status:</strong> {selectedClaim.status}</p>
                <p><strong>Date:</strong> {new Date(selectedClaim.created_at).toLocaleString()}</p>
                <a href={selectedClaim.image} target="_blank" rel="noopener noreferrer">
                  <img src={selectedClaim.image} alt="" className="mt-2 rounded w-full" />
                </a>
                <button className="mt-4 px-4 py-2 bg-(--accent) text-white rounded" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}

          {showConfirmModal && selectedClaim && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-(--primary) p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this support ticket?</p>
                <div className="mt-4 flex justify-end gap-3">
                  <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={deleteClaim}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div></>
  );
};

export default AllClaims;