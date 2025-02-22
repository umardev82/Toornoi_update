import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";
import { IoMdCloseCircle } from "react-icons/io";
import { FaArrowCircleRight } from "react-icons/fa";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API_BASE_URL from "../config";

const stripePromise = loadStripe("pk_test_51I6yXKB5JXE1z3xCRkMRqslvIaTP6AygRvuBWFWsji8Qiv6dzVzBk9KL0TTCj8FXff9pRRJZIDA7enKPLdL95TD200hShvmjKH");

const CheckoutForm = ({ tournamentId, registrationFee, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff", // White text color
        "::placeholder": {
          color: "#aaaaaa", // Light gray placeholder
        },
      },
      invalid: {
        color: "#ff4d4d", // Red text for errors
      },
    },
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${API_BASE_URL}/tournament_user/${tournamentId}/register/`,
        { payment_method_id: paymentMethod.id },
        { headers: { Authorization: `Token ${token}` } }
      );
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 checkout-form w-full">
      <h2 className=" font-bold mb-5 lemon-milk-font">Complete Your Registration</h2>
      <div>
        <label className="block text-sm mb-2 text-(--textlight)">Card Number</label>
        <div className="p-3 block w-full bg-transparent border border-(--border) rounded-sm text-sm text-(--textlight)">
          <CardNumberElement options={elementOptions}/>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-2 text-(--textlight)">Expiry Date</label>
        <div className="p-3 block w-full bg-transparent border border-(--border) rounded-sm text-sm text-(--textlight)">
          <CardExpiryElement options={elementOptions} />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-2 text-(--textlight)">CVC</label>
        <div className="p-3 block w-full bg-transparent border border-(--border) rounded-sm text-sm text-(--textlight)">
          <CardCvcElement options={elementOptions} />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={loading} className="w-full bg-(--accent) text-white py-2 rounded-lg">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const SingleTournament = () => {
  const { id } = useParams();
  const { getTournament } = useTournament();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalStep, setModalStep] = useState("details");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setTournament(await getTournament(id));
      setLoading(false);
    })();
  }, [id]);
  

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


  if (loading) return <p>Loading...</p>;

  return (
   <>
  {tournament?.cover_image && (
        <div>
          <img
            src={tournament.cover_image}
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
    ? formatDateTime(tournament.registration_deadline)
    : "Not Set"} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Registration Fee:</span> {tournament?.registration_fee}€</p>
        </div>
        <div className="text-end">
        <button onClick={() => setShowModal(true)} className="py-2 px-5 bg-(--accent) rounded">Register</button>
        <div className=" text-white mt-3 px-3 py-1 rounded-lg">
        🏆 <span className="font-bold">Prize:</span>  {tournament.prize_details}
        </div>
        </div>
       
        <div>
       
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
          <h2 className="font-bold text-(--textwhite)">Bracket Type</h2>
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
      <h6 className="mt-2">Position 1</h6>
      <p>{tournament?.positions_1}</p>
      <h6 className="mt-2">Position 2</h6>
      <p>{tournament?.positions_2}</p>
      <h6 className="mt-2">Position 3</h6>
      <p>{tournament?.positions_3}</p>      
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
         <h2 className="lemon-milk-font mb-4">Sponsor Logos</h2>
         <img src={tournament?.sponsor_logos} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
        <h2 className="lemon-milk-font mb-4">Code of Conduct</h2>
        <img src={tournament?.code_of_conduct} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
        <div className="">
        <button onClick={() => setShowModal(true)} className="py-2 px-5 bg-(--accent) rounded text-(--textwhite) mt-4">Register</button>
       
        </div>

      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-5 z-50 ">
          <div className="bg-(--primary) text-(--textwhite) rounded-lg shadow-lg w-96 relative p-6 flex flex-col items-center justify-center min-h-[30vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5">
              <IoMdCloseCircle />
            </button>
            {modalStep === "details" ? (
  <>
    <div className="text-left">
    <h2 className="font-bold mb-5 lemon-milk-font">Tournament Details</h2>
  
       <p ><strong>Fee:</strong> ${tournament?.registration_fee}</p>
    <p ><strong>Rules:</strong> {tournament?.rules_and_regulations}</p>
   
    <button onClick={() => setModalStep("checkout")} className="flex items-center gap-2 mt-4 px-4 py-2 bg-(--accent) text-white rounded">
      Proceed to Payment <span><FaArrowCircleRight /></span>
    </button></div>
  </>
) : modalStep === "checkout" ? (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      tournamentId={id}
      registrationFee={tournament?.registration_fee}
      onSuccess={() => setModalStep("success")}
      
    />
  </Elements>
) : (
  <>
    <h2 className="font-bold mb-5 lemon-milk-font text-white text-center">Registration Successful! 🎉</h2>
    <p className="text-center">Thank you for registering for the tournament. </p>
   
  </>
)}

    </div>
  </div>
)}

    </>
  );
};

export default SingleTournament;
