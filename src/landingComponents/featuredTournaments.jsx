import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const FeaturedTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/published-tournaments/`);
        setTournaments(response.data.slice(0, 4)); // Get only the first 3
      } catch (error) {
        toast.error("Failed to fetch tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return  <div className="w-full flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      {tournaments.map((tournament, index) => (
        <Link
          to={`/tournament/${tournament.id}`}
          key={index}
          className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-lg overflow-hidden min-h-[350px] bg-center bg-cover bg-no-repeat flex flex-col justify-between relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url(${tournament.cover_image})`,
          }}
        >
          {tournament.is_registered && (
            <div className="absolute top-3 right-3 bg-green-800 text-white text-xs font-bold p-1 rounded-lg">
              ✅ Enregistré
            </div>
          )}

          <div className="p-4 space-y-2">
            <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
              📅 {tournament.start_date || "Non défini"}
            </div>
            <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
            💳 Frais d'inscription :  {tournament.registration_fee}€
            </div>
            <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
            🏆 Prix : {tournament.positions_1}€
            </div>
          </div>

          <div className="p-4 mt-auto">
            <div className="inline-block bg-(--secondary) text-white text-xs font-medium px-3 py-1 rounded-lg">
            Heure :  {tournament.time || "Non défini"}
            </div>
            <h3 className="mt-3 text-2xl lemon-milk-medium">{tournament.tournament_name}</h3>
            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{tournament.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedTournaments;
