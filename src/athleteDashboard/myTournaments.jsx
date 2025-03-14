import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import API_BASE_URL from "../config";

const MyTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [matches, setMatches] = useState([]); // 🔹 New state for matches
  const [pendingMatches, setPendingMatches] = useState([]); // 🔹 Pending matches
  const [completedMatches, setCompletedMatches] = useState([]); // 🔹 Completed matches

  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const paginatedTournaments = filteredTournaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    fetchTournaments();
    fetchMatches(); // 🔹 Fetch matches when the component mounts
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${API_BASE_URL}/my_tournaments/my_tournaments/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let data = Array.isArray(response.data) ? response.data : [response.data];
      setTournaments(data);
      setFilteredTournaments(data);
      extractCategories(data);
      extractPriceRanges(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setTournaments([]);
      setFilteredTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${API_BASE_URL}/profile-matches/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = Array.isArray(response.data) ? response.data : [response.data];
      setMatches(data);

      // Separate matches into pending and completed
      const pending = data.filter(match => match.status === "Pending");
      const completed = data.filter(match => match.status === "Completed");
      setPendingMatches(pending);
      setCompletedMatches(completed);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    }
  };

  const extractCategories = (data) => {
    const uniqueCategories = [...new Set(data.map((tournament) => tournament.category))];
    setCategories(uniqueCategories);
  };

  const extractPriceRanges = (data) => {
    const fees = data.map((tournament) => parseInt(tournament.registration_fee)).filter(Boolean);
    if (fees.length === 0) return;

    const minFee = Math.min(...fees);
    const maxFee = Math.max(...fees);

  

    const ranges = [
      { label: `${minFee} €- ${minFee + 50} €`, value: `${minFee}-${minFee + 50}` },
      { label: `${minFee + 51} € - ${minFee + 100} €`, value: `${minFee + 51}-${minFee + 100}` },
      { label: `${maxFee - 100} € - ${maxFee} €`, value: `${maxFee - 100}-${maxFee}` },
      { label: `${maxFee} € +`, value: `${maxFee}+` },
    ];

    setPriceRanges(ranges);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-GB");
  };

  const formatOnlyTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) return "Invalid Time";
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    setLoading(true);
    let filteredData = tournaments.filter((tournament) => {
      return (
        (search === "" || tournament.tournament_name.toLowerCase().includes(search.toLowerCase())) &&
        (category === "" || tournament.category === category) &&
        (priceRange === "" || checkPriceRange(tournament.registration_fee, priceRange))
      );
    });

    setTimeout(() => {
      setFilteredTournaments(filteredData);
      setLoading(false);
    }, 500);
  }, [search, category, priceRange, tournaments]);

  const checkPriceRange = (fee, range) => {
    if (!fee) return false;
    const price = parseInt(fee);
    const [min, max] = range.split("-").map(Number);
    if (!max) return price >= min;
    return price >= min && price <= max;
  };

  return (
    <>
      {/* 🔹 Search & Filter Section */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher un tournoi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-(--border) p-2 rounded text-white bg-(--primary)"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-(--border) p-2 rounded text-white bg-(--primary)">
          <option value="">Toutes les catégories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="border p-2 border-(--border) rounded text-white bg-(--primary)">
          <option value="">Tous les prix</option>
          {priceRanges.map((range, index) => (
            <option key={index} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* 🔹 Tournament Cards or Loader */}
      {loading ? (
        <div className="w-full flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : paginatedTournaments.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTournaments.map((tournament, index) => (
              <Link 
                to={`/my-account/my-tournaments/${tournament.id}`} 
                key={index} 
                className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-lg overflow-hidden min-h-[350px] bg-center bg-cover bg-no-repeat flex flex-col justify-between relative"
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url(${API_BASE_URL}${tournament.cover_image})`
                }}
              >  
                <div className="p-4 space-y-2">
                  <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
                    📅  {tournament.start_date 
                      ? `${formatDate(tournament.start_date)}`
                      : "Not Set"}
                  </div>
                  <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
                  💳 Frais d'inscription: {tournament.registration_fee}€
                  </div>
                  <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
                    🏆 Prix: {tournament.positions_1}€
                  </div>
                </div>           

                {/* Content */}
                <div className="p-4 mt-auto">
                  {/* Fee Badge */}
                  <div className="inline-block bg-(--secondary) text-white text-xs font-medium px-3 py-1 rounded-lg">
                    Temps: {tournament.time ? formatOnlyTime(tournament.time) : "Not Set"}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-2xl lemon-milk-medium">{tournament.tournament_name}</h3>

                  {/* Description (2-line clamp) */}
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{tournament.description}</p>
                </div>
              </Link>
            ))}
          </div>
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
        </>
      ) : (
        <div className="w-full flex justify-center items-center min-h-[300px] text-center font-bold text-white p-4">
          Aucun tournoi trouvé.
        </div>
      )}

      {/* 🔹 Matches Section */}
      <div className="mt-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Matches */}
          <div>
            <div className="flex justify-between">
            <h3 className=" font-bold text-white mb-2">Matchs en attente</h3>
            <Link to="/my-account/matches" className="text-(--accent)">Tout voir</Link>
            </div>
           
            {pendingMatches.length > 0 ? (
              pendingMatches.map((match, index) => (
                <div key={index} className="bg-(--primary) p-4 rounded-lg mb-4 relative border border-(--border)">
                <p className=" absolute right-4 w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">📅 {match.date 
                      ? `${formatDate(match.date)}`
                      : "Not Set"}</p> 
                <p className="text-white font-bold max-w-[70%]">{match.tournament}</p>
                
                <p className="text-(--textlight)"><b>Résultat du match :</b> {match.match_result}</p>               
              </div>
              ))
            ) : (
              <p className="text-(--textwhite)">Aucune correspondance en attente.</p>
            )}
          </div>

          {/* Completed Matches */}
          <div>
            <div className="flex justify-between">           
            <h3 className=" font-bold text-white mb-2">Matchs terminés</h3>
            <Link to="/my-account/matches" className="text-(--accent)">Tout voir</Link>
            </div>
            {completedMatches.length > 0 ? (
              completedMatches.map((match, index) => (
                <div key={index} className="bg-(--primary) p-4 rounded-lg mb-4 relative border border-(--border)">
                <p className=" absolute right-4 w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">📅 {match.date 
                      ? `${formatDate(match.date)}`
                      : "Not Set"}</p> 
                <p className="text-white font-bold max-w-[70%]">{match.tournament}</p>
                
                <p className="text-(--textlight)"><b>Résultat du match:</b> {match.match_result}</p>               
              </div>
              ))
            ) : (
              <p className="text-(--textwhite)">Aucun match terminé.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTournaments;