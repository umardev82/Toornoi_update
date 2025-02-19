import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";

const RegisteredAthletes = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // Track which row is updating
  const API_URL = `${API_BASE_URL}/register_athletes_tournament/`;

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(API_URL);
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id); // Show loader for this row
    const updateToast = toast.loading("Updating status..."); // Show loading toast
  
    try {
      await axios.patch(`${API_URL}${id}/`, { payment_status: newStatus });
  
      // Optimistic UI update
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, payment_status: newStatus } : item
        )
      );
  
      toast.success("Payment status updated!", { id: updateToast }); // Dismiss loading and show success
    } catch (error) {
      toast.error("Failed to update status.", { id: updateToast }); // Dismiss loading and show error
    } finally {
      setLoadingId(null); // Hide loader
    }
  };
  

  return (
    <> 
     <Toaster/>
     
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
        <thead className="bg-(--secondary) p-2 rounded-sm text-white">
          <tr className="rounded-2xl">
            <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Username</th>
            <th className="p-3 font-medium whitespace-nowrap w-max">Tournament</th>
            <th className="p-3 font-medium whitespace-nowrap w-max">Registered At</th>
            <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center font-bold text-white p-4">No registrations found.</td>
            </tr>
          ) : (
            registrations.map((item) => (
              <tr key={item.id} className="bg-(--primary) text-(--textlight)">
                <td className="p-3 whitespace-nowrap">{item.username}</td>
                <td className="p-3 whitespace-nowrap">{item.tournament_name}</td>
                <td className="p-3 whitespace-nowrap">
                  {new Date(item.registered_at).toLocaleString("en-GB")}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {loadingId === item.id ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>
                    </div>
                  ) : (
                    <select
                      className="p-2 border border-(--border) rounded bg-(--secondary) text-(--textwhite) w-full"
                      value={item.payment_status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    
    </>
   
  );
};

export default RegisteredAthletes;
