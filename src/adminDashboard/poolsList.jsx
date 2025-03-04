import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const PoolList = () => {
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}/pools/`;

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        setPools(response.data);
      } else {
        setPools([]);
      }
    } catch (error) {
      console.error("Error fetching pools:", error);
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (pool) => {
    setSelectedPool(pool);
    setShowConfirmModal(true);
  };
    // Function to format date with time as DD/MM/YYYY - HH:MM
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid dates
  return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
};

  const deletePool = async () => {
    if (!selectedPool) return;
    setShowConfirmModal(false);

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(`${API_URL}${selectedPool.id}/`);
        setPools((prev) => prev.filter((p) => p.id !== selectedPool.id));
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        setSelectedPool(null);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting pool...",
      success: "Pool deleted successfully!",
      error: "Failed to delete pool.",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
        <thead className="bg-(--secondary) p-2 rounded-sm text-white">
          <tr>
            <th className="p-3 font-medium">Tournament</th>
            <th className="p-3 font-medium">Pool Number</th>
            <th className="p-3 font-medium">Start Date</th>
            <th className="p-3 font-medium">End Date</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center p-4">Loading...</td>
            </tr>
          ) : pools.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center font-bold text-white p-4">No pools found.</td>
            </tr>
          ) : (
            pools.map((pool) => (
              <tr key={pool.id} className="bg-(--primary) text-(--textlight)">
                <td className="p-3">{pool.tournament}</td>
                <td className="p-3">{pool.pool_number}</td>
                <td className="p-3">{pool.start_date
    ? formatDateTime(pool.start_date): "Not Set"}</td>
                <td className="p-3">{pool.end_date
    ? formatDateTime(pool.end_date): "Not Set"}</td>
                <td className="p-3">
                  <div className="flex gap-3">  
                  <Link to={`/dashboard/pools/${pool.id}`}>
                  <FaEye className="text-(--accent)" />   </Link>              
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

      {showConfirmModal && selectedPool && (
        <div className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/85 z-50 p-5">
          <div className="bg-(--primary) p-6 rounded-lg shadow-lg md:w-[40%] w-full">
            <h2 className="text-(--textwhite) mb-4">Confirm Delete</h2>
            <p className="text-(--textlight) mb-4">
              Are you sure you want to delete the pool for tournament <strong>{selectedPool.tournament_name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-(--accent) text-(--textwhite) rounded-md" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={deletePool}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolList;
