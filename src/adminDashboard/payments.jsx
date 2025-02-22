import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";

const Payments = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

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
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id);
    const updateToast = toast.loading("Updating status...");

    try {
      await axios.patch(`${API_URL}${id}/`, { payment_status: newStatus });

      setFilteredRegistrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, payment_status: newStatus } : item
        )
      );

      toast.success("Payment status updated!", { id: updateToast });
    } catch (error) {
      toast.error("Failed to update status.", { id: updateToast });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="md:flex justify-between items-center">
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Payments</h1>

{/* 🔹 Tournament Filter Dropdown */}
<div className="mb-4">
  <select
    value={selectedTournament}
    onChange={handleTournamentFilter}
    className="p-2 border border-(--border) rounded bg-(--secondary) text-(--textwhite) w-full"
  >
    <option value="">All Tournaments</option>
    {tournaments.map((tournament) => (
      <option key={tournament.id} value={tournament.tournament_name}>
        {tournament.tournament_name}
      </option>
    ))}
  </select>
</div>
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
              <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Username</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Tournament</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Registered At</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Payment Status</th>
              <th className="p-3 font-medium whitespace-nowrap w-max rounded-r-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center font-bold text-white p-4">
                  No registrations found.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((item) => (
                <tr key={item.id} className="bg-(--primary) text-(--textlight)">
                  <td className="p-3 whitespace-nowrap">{item.username}</td>
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
          {filteredRegistrations.length > 0 &&
  filteredRegistrations.some(item => item.amount > 0) && (
    <tfoot>
      <tr className="bg-(--secondary) text-white font-bold">
        <td colSpan="4" className="p-3 text-right">Total Amount:</td>
        <td className="p-3">
          {Number(filteredRegistrations.reduce((sum, item) => sum + (item.amount || 0), 0)).toLocaleString("en-US")} €
        </td>
      </tr>
    </tfoot>
  )
}


        </table>
        
        )}
      </div>
    </>
  );
};

export default Payments;
