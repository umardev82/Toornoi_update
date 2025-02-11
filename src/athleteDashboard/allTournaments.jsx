import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import API_BASE_URL from "../config";

const AllTournaments = () => {
  const [tournaments, setTournaments] = useState([]); // Ensure this is always an array

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tournament_user/`);
      console.log("API Response:", response.data); // Debugging log

      // Ensure response is always an array
      if (Array.isArray(response.data)) {
        setTournaments(response.data);
      } else if (typeof response.data === "object") {
        setTournaments([response.data]); // Wrap single object in an array
      } else {
        console.error("Unexpected response format:", response.data);
        setTournaments([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setTournaments([]); // Prevent breaking .map()
    }
  };



 

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-white border-separate border-spacing-y-2 border border-transparent">
          <thead className="bg-(--secondary) p-2 rounded-sm text-white">
            <tr className="rounded-2xl">
              <th className="p-3 font-medium rounded-l-md whitespace-nowrap w-max">Tournament</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Description</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Status</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Time</th>
              <th className="p-3 font-medium whitespace-nowrap w-max">Date</th>
              <th className="p-3 font-medium rounded-r-md whitespace-nowrap w-max">Action</th>
            </tr>
          </thead>
          <tbody>
            {(tournaments || []).map((tournament, index) => (
              <tr key={index} className="bg-(--primary) text-(--textlight)">
                <td className="p-3 flex items-center space-x-3 rounded-r-md whitespace-nowrap w-max">
                  <img
                    src={tournament.cover_image}
                    alt="Tournament"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span>{tournament.tournament_name}</span>
                </td>
                <td className="p-3 truncate max-w-[50px] whitespace-nowrap">{tournament.description}</td>
                <td className="p-3 whitespace-nowrap w-max">
                  <span className="bg-[#433E29] text-[#E5BA18] px-3 pb-1 rounded-full">
                    {tournament.status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap w-max">{tournament.time}</td>
                <td className="p-3 whitespace-nowrap w-max">{tournament.start_date}</td>
                <td className="p-3 whitespace-nowrap w-max">
                  <div className="flex gap-3">
                    <Link to={`/my-account/tournament/${tournament.id}`} className="flex items-center gap-2"> View
                      <FaEye className="text-(--accent)" />
                    </Link>                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  );
};

export default AllTournaments;
