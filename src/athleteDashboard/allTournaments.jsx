import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import API_BASE_URL from "../config";

const AllTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(false); // 🔹 Loader state

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tournament_user/`);
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
      setLoading(false);
    }, 500); // Small delay for smooth transition
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
          placeholder="Search tournament..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-(--border) p-2 rounded text-white bg-(--primary)"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-(--border) p-2 rounded text-white bg-(--primary)">
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="border p-2 border-(--border) rounded text-white bg-(--primary)">
          <option value="">All Prices</option>
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
) : filteredTournaments.length > 0 ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredTournaments.map((tournament, index) => (
      <Link 
        to={`/my-account/tournament/${tournament.id}`} 
        key={index} 
        className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-lg overflow-hidden min-h-[350px] bg-center bg-cover bg-no-repeat flex flex-col justify-between relative"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url(${tournament.cover_image})` }}
      >             
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-black/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
          📅 {tournament.start_date}
        </div>

        {/* Content */}
        <div className="p-4 mt-auto">
          {/* Fee Badge */}
          <div className="inline-block bg-(--secondary) text-white text-xs font-medium px-3 py-1 rounded-lg">
            Time: {tournament.time}
          </div>

          {/* Title */}
          <h3 className="mt-3 text-2xl lemon-milk-medium">{tournament.tournament_name}</h3>

          {/* Description (2-line clamp) */}
          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{tournament.description}</p>
        </div>
      </Link>
    ))}
  </div>
) : (
  <div className="w-full flex justify-center items-center min-h-[300px] text-center font-bold text-white p-4">
    No tournaments found.
  </div>
)}

    </>
  );
};

export default AllTournaments;
