import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const RegisteredAthletesTournaments = () => {
  const { tournament_id } = useParams();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tournaments/${tournament_id}/registered_users/`);
        setAthletes(response.data.registered_users || []);
      } catch (error) {
        console.error("Error fetching registered athletes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [tournament_id]);

  // Function to handle payment status change
  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id); // Show loading spinner for the specific row

    try {
      await axios.patch(`${API_BASE_URL}/update_payment_status/${id}/`, {
        payment_status: newStatus,
      });

      // Update the state with new status
      setAthletes((prevAthletes) =>
        prevAthletes.map((athlete) =>
          athlete.id === id ? { ...athlete, payment_status: newStatus } : athlete
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
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
              <th className="p-3 font-medium whitespace-nowrap w-max">Email</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Registered At</th>
              <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {athletes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center font-bold text-white p-4">
                  No registered athletes found.
                </td>
              </tr>
            ) : (
              athletes.map((athlete) => (
                <tr key={athlete.id} className="bg-(--primary) text-(--textlight)">
                  <td className="p-3 whitespace-nowrap">{athlete.username}</td>
                  <td className="p-3 whitespace-nowrap">{athlete.email}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(athlete.registered_at).toLocaleString("en-GB")}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                  <span className="bg-green-900 rounded text-white text-sm py-1 px-4">
                  {athlete.payment_status} </span>                   
                  </td>
                 
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegisteredAthletesTournaments;
