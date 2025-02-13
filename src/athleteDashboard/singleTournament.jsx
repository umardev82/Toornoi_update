import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";

const SingleTournament = () => {
  const { id } = useParams();
  const { getTournament } = useTournament();
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility


  // Use useCallback to prevent unnecessary function recreation
  const fetchTournamentData = useCallback(async () => {
    try {
      const tournament = await getTournament(id);
      setTournamentData((prevData) => {
        // Avoid updating state if the data is the same
        if (prevData?.id !== tournament.id) {
          return tournament;
        }
        return prevData; // return the current state if there's no change
      });
    } catch (err) {
      setError("Failed to fetch tournament data");
    } finally {
      setLoading(false);
    }
  }, [id, getTournament]);

  useEffect(() => {
    fetchTournamentData();
  }, [fetchTournamentData]); // Ensures it runs only when needed

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <> 
      {tournamentData?.cover_image && (
        <div>
          <img
            src={tournamentData.cover_image}
            alt="Cover"
            className="w-full h-64 mb-5 rounded-md object-cover"
          />
        </div>
      )}
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) grid grid-cols-2">
        <div>
        <h1 className="text-xl lemon-milk-font mb-4">{tournamentData?.tournament_name}</h1>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Date:</span> {tournamentData?.start_date} - {tournamentData?.end_date} </p>
         <p className=" text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Deadline:</span> {tournamentData?.registration_deadline} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Fee:</span> {tournamentData?.registration_fee} €</p>
        </div>
        <div className="text-end">
        <button onClick={() => setShowModal(true)} className="py-2 px-5 bg-(--accent) rounded">Register</button>
        <div className=" text-white mt-3 font-medium px-3 py-1 rounded-lg">
        🏆Prize: {tournamentData.prize_details}
        </div>
        </div>
       
        <div>
       
        </div>
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="lemon-milk-font">Description</h2>
      <p>{tournamentData?.description}</p>
      </div>
      

      <div className="grid md:grid-cols-2 gap-4  mt-5 bg-(--primary) p-5 rounded">
        <div>
          <h2 className="font-bold text-(--textwhite)">Category</h2>
          <p className="text-(--textlight)">{tournamentData?.category}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Eligibility Criteria</h2>
          <p className="text-(--textlight)">{tournamentData?.eligibility_criteria}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Country</h2>
          <p className="text-(--textlight)">{tournamentData?.country}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Region</h2>
          <p className="text-(--textlight)">{tournamentData?.region}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Bracket Type</h2>
          <p className="text-(--textlight)">{tournamentData?.bracket_type}</p>
        </div>
       
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="font-xl font-bold">Rules and Regulations</h2>
      <p>{tournamentData?.rules_and_regulations}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Match Rules</h2>
      <p>{tournamentData?.match_rules}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Prize Details</h2>
      <p>{tournamentData?.prize_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Dispute Resolution Process</h2>
      <p>{tournamentData?.dispute_resolution_Process}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Sponsorship Details</h2>
      <p>{tournamentData?.sponsorship_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Partnership Info</h2>
      <p>{tournamentData?.partnership_info}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Refund Policy</h2>
      <p>{tournamentData?.refund_policy}</p>
      </div>
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Prize Distribution</h2>
      <p>{tournamentData?.prize_distribution}</p>
      <hr className="my-5  border-(--border)"/>
      <h6 className="mt-2">Position 1</h6>
      <p>{tournamentData?.positions_1}</p>
      <h6 className="mt-2">Position 2</h6>
      <p>{tournamentData?.positions_2}</p>
      <h6 className="mt-2">Position 3</h6>
      <p>{tournamentData?.positions_3}</p>      
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
         <h2 className="lemon-milk-font mb-4">Sponsor Logos</h2>
         <img src={tournamentData?.sponsor_logos} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
        <h2 className="lemon-milk-font mb-4">Code of Conduct</h2>
        <img src={tournamentData?.code_of_conduct} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
        <div className="">
        <button onClick={() => setShowModal(true)} className="py-2 px-5 bg-(--accent) rounded text-(--textwhite) mt-4">Register</button>
       
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">Registration Details</h2>
            <p><strong>Fee:</strong> ${tournamentData?.registration_fee}</p>
            <p >
            <p><strong>Terms and condition:</strong> {tournamentData?.rules_and_regulations}</p>
            </p>
            
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="mr-3 px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button className="px-4 py-2 bg-(--accent) text-white rounded">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default SingleTournament;
