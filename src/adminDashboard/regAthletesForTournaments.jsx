import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const RegisteredAthletesTournaments = () => {
  const { tournament_id } = useParams();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(athletes.length / itemsPerPage);
  const paginatedAthletes = athletes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));


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
 

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
        <h2 className="lemon-milk-font text-white mb-4">Athlètes inscrits</h2>
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Nom d'utilisateur</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">E-mail</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">	Enregistré à</th>
              <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Statut de paiement</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAthletes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center font-bold text-white p-4">
                Aucun athlète inscrit trouvé.
                </td>
              </tr>
            ) : (
              paginatedAthletes.map((athlete) => (
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
        </table></>
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
    </div>
  );
};

export default RegisteredAthletesTournaments;
