import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";
import TournamentFallBack from "../assets/images/profile-bg.png";

const SingleTournamentPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setTournament(await getTournament(id));
      setLoading(false);
    })();
  }, [id]);
  
  const getTournament = async (id) => {
    setLoading(true);
    try { // Get token from local storage
      const response = await axios.get(`${API_BASE_URL}/published-tournaments/${id}/`);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch tournament", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-GB");
  };

  if (loading) return <div className="w-full flex justify-center items-center min-h-[300px]">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
</div>;

  return (
 <div className="bg-black md:pt-[20vh]">
   <div className="container mx-auto  p-5">
  {tournament?.cover_image && (
        <div>
          <img
            src={tournament.cover_image || TournamentFallBack}
            alt="Cover"
            className="w-full h-64 mb-5 rounded-md object-cover"
          />
        </div>
      )}
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) grid grid-cols-2">
        <div>
        <h1 className="text-xl lemon-milk-font mb-4">{tournament?.tournament_name}</h1>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Date:</span> {tournament.start_date && tournament.end_date
    ? `${formatDate(tournament.start_date)} - ${formatDate(tournament.end_date)}`
    : "Not Set"}</p>
         <p className=" text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Deadline:</span>  {tournament.registration_deadline
    ? formatDate(tournament.registration_deadline)
    : "Not Set"} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Fee:</span> {tournament?.registration_fee}€</p>
        </div>
        <div className="text-end">
        <Link 
        to={`/my-account/tournament/${tournament.id}`}
        key={tournament.id}
         className={`py-2 px-5 rounded ${tournament?.is_registered ? "bg-gray-500 cursor-not-allowed" : "bg-(--accent) text-white"}`}
         >
    Register
  </Link>
        <div className=" text-white mt-3 px-3 py-1 rounded-lg">
        🏆 <span className="font-bold">Prize:</span>  {tournament.positions_1}€
        </div>
        </div>
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="lemon-milk-font">Description</h2>
      <p>{tournament?.description}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4  mt-5 bg-(--primary) p-5 rounded">
        <div>
          <h2 className="font-bold text-(--textwhite)">Category</h2>
          <p className="text-(--textlight)">{tournament?.category}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Eligibility Criteria</h2>
          <p className="text-(--textlight)">{tournament?.eligibility_criteria}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Country</h2>
          <p className="text-(--textlight)">{tournament?.country}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Region</h2>
          <p className="text-(--textlight)">{tournament?.region}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Tournamnet Type</h2>
          <p className="text-(--textlight)">{tournament?.bracket_type}</p>
        </div>
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="font-xl font-bold">Rules and Regulations</h2>
      <p>{tournament?.rules_and_regulations}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Match Rules</h2>
      <p>{tournament?.match_rules}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Prize Details</h2>
      <p>{tournament?.prize_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Dispute Resolution Process</h2>
      <p>{tournament?.dispute_resolution_Process}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Sponsorship Details</h2>
      <p>{tournament?.sponsorship_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Partnership Info</h2>
      <p>{tournament?.partnership_info}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Refund Policy</h2>
      <p>{tournament?.refund_policy}</p>
      </div>
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Prize Distribution</h2>
      <p>{tournament?.prize_distribution}</p>
      <hr className="my-5  border-(--border)"/>
      <h6 className="mt-2">Winner</h6>
      <p>{tournament?.positions_1}€</p>
      <h6 className="mt-2">Runner Up</h6>
      <p>{tournament?.positions_2}€</p>    
      </div>
      <div className="text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Notes:</h2>
      <p className="italic">{tournament?.prize_details}</p>      
      </div>
      <div className=" text-(--textwhite) my-8 text-right flex gap-2 flex-wrap">
 
 {tournament?.code_of_conduct ? (
   <a 
     href={tournament.code_of_conduct} 
     target="_blank" 
     rel="noopener noreferrer" 
     className="bg-(--accent) text-white py-2 px-5 rounded"
   >
     Code of Conduct
   </a>
 ) : (
   <button 
     disabled 
     className="bg-gray-500 py-2 px-5 cursor-not-allowed rounded"
   >
     Code of Conduct (Unavailable)
   </button>
 )}
 
       
</div>
      
     
    </div></div>
  );
};

export default SingleTournamentPage;