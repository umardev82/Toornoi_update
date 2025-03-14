import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import TournamentFallBack from "../assets/images/profile-bg.png";

const AllFeaturedTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/published-tournaments/`);
        setTournaments(response.data);
        setFilteredTournaments(response.data);
        extractCategories(response.data);
      extractPriceRanges(response.data);
      } catch (error) {
        toast.error("Échec de la récupération des tournois");
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

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
      { label: `$${minFee} - $${minFee + 50}`, value: `${minFee}-${minFee + 50}` },
      { label: `$${minFee + 51} - $${minFee + 100}`, value: `${minFee + 51}-${minFee + 100}` },
      { label: `$${maxFee - 100} - $${maxFee}`, value: `${maxFee - 100}-${maxFee}` },
      { label: `$${maxFee}+`, value: `${maxFee}+` },
    ];

    setPriceRanges(ranges);
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
      setCurrentPage(1); // Reset to page 1 after filtering
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


  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const paginatedTournaments = filteredTournaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
 

  return (
    <>
      <div className="bg-gradient-to-b from-[#060606] to-[#031d29] flex sm:items-end items-center py-24 px-5 md:h-[70vh] h-[50vh]">
        <div className="container w-full mx-auto">
          <h1 className="text-white sm:text-4xl text-3xl sm:text-left text-center lemon-milk-font font-semibold mb-5">Tous les tournois en vedette</h1>
        </div>
      </div>
    <div className="bg-black px-5 py-14 ">
  <div className="container mx-auto">
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
      <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="border border-(--border) p-2 rounded text-white bg-(--primary)">
        <option value="">Tous les tarifs</option>
        {priceRanges.map((range, index) => (
          <option key={index} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>

    {/* Loader only in the listing section */}
    {loading ? (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    ) : paginatedTournaments.length === 0 ? (
      <div>
        <p  className="text-center font-bold text-white p-4">
        Aucun tournoi trouvé.
        </p>
      </div>
    ) : (
      <>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedTournaments.map((tournament) => (
            <Link
              to={`/tournament/${tournament.id}`}
              key={tournament.id}
              className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-lg overflow-hidden min-h-[350px] bg-center bg-cover bg-no-repeat flex flex-col justify-between relative"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url(${tournament.cover_image || TournamentFallBack})`,
              }}
            >
                         <div className="p-4 space-y-2">
             <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
               📅 {tournament.start_date || "Non défini"}
             </div>
             <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
             💳 Frais d'inscription: {tournament.registration_fee}€
             </div>
             <div className="w-fit bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
             🏆 Prix: {tournament.positions_1}€
             </div>
              </div>
              <div className="p-4 mt-auto">
              <div className="inline-block bg-(--secondary) text-white text-xs font-medium px-3 py-1 rounded-lg">
              Heure: {tournament.time || "Non défini"}
            </div>
                <h3 className="mt-3 text-2xl lemon-milk-medium">{tournament.tournament_name}</h3>
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
    )}
  </div>
</div>

    </>
  );
};

export default AllFeaturedTournaments;
