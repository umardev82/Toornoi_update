import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

const SingleTournament = () => {
  const { id } = useParams();
  const { getTournament } = useTournament();
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Tournament fetching error state
  const [showModal, setShowModal] = useState(false);
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchTournamentData = async () => {
    try {
      const tournament = await getTournament(id);
      setTournamentData((prevData) => {
        if (prevData?.id !== tournament.id) {
          return tournament;
        }
        return prevData;
      });
    } catch (err) {
      setError("Failed to fetch tournament data");
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchTournamentData();
    }
  }, [id, hasFetched]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date)) return "Invalid Date";
    return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-GB");
  };

  const handleRegister = async () => {
    setRegistering(true);
    setError(null);  // Reset error for registration
    setRegistrationResponse(null);
  
    const token = localStorage.getItem("userToken");
  
    if (!token) {
      setError("Authentication error: Please log in first.");
      setShowModal(true); // Ensure modal opens on error
      setRegistering(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tournament_user/${id}/register/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data?.message) {
        setRegistrationResponse(response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. You might already be registered.");
    } finally {
      setShowModal(true); // Show modal for errors
      setRegistering(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !showModal) return <p className="text-white">{error}</p>;  // Show fetch error outside the modal

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
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Date:</span> {tournamentData.start_date && tournamentData.end_date
    ? `${formatDate(tournamentData.start_date)} - ${formatDate(tournamentData.end_date)}`
    : "Not Set"}</p>
         <p className=" text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Deadline:</span>  {tournamentData.registration_deadline
    ? formatDateTime(tournamentData.registration_deadline)
    : "Not Set"} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Fee:</span> {tournamentData?.registration_fee}€</p>
        </div>
        <div className="text-end">
        <button onClick={() => setShowModal(true)} className="py-2 px-5 bg-(--accent) rounded">Register</button>
        <div className=" text-white mt-3 px-3 py-1 rounded-lg">
        🏆 <span className="font-bold">Prize:</span>  {tournamentData.prize_details}
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
      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-5">
    <div className="bg-white  rounded-lg shadow-lg w-96 relative p-6">
    <Link to="/my-account/tournaments" className="absolute top-5 right-5">
    <IoMdCloseCircle />
            </Link>
      <h2 className="text-xl font-bold mb-3">Registration Details</h2>

      {/* Success message and checkout link */}
      {registrationResponse && !error && (
        <>
          <p><strong>Status:</strong> {registrationResponse.message}</p>
          {registrationResponse.sumup_link && (
            <a
              href={registrationResponse.sumup_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 px-4 py-2 bg-(--accent) text-white text-center rounded"
            >
              Proceed to Checkout
            </a>
          )}
        </>
      )}

      {/* Show registration error */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Default UI when neither error nor response exists */}
      {!registrationResponse && !error && (
        <>
          <p><strong>Fee:</strong> ${tournamentData?.registration_fee}</p>
          <p><strong>Terms and conditions:</strong> {tournamentData?.rules_and_regulations}</p>
          <div className="mt-4 flex ">
          
            <button
              onClick={handleRegister}
              disabled={registering}
              className="px-4 py-2 bg-(--accent) text-white rounded"
            >
              {registering ? "Processing..." : "Register"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default SingleTournament;
