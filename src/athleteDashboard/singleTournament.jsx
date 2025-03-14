import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      setError(err.response?.data?.error || "Le paiement a échoué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 checkout-form w-full">
      <h2 className=" font-bold mb-5 lemon-milk-font">Complétez votre inscription</h2>
      <div>
        <label className="block text-sm mb-2 text-(--textlight)">Numéro de carte
        </label>
        <div className="p-3 block w-full bg-transparent border border-(--border) rounded-sm text-sm text-(--textlight)">
          <CardNumberElement options={elementOptions}/>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-2 text-(--textlight)">Date d'expiration</label>
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
        {loading ? "Traitement..." : "Payer maintenant"}
      </button>
    </form>
  );
};

const SingleTournament = () => {
  const { id } = useParams();
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
  
  const getTournament = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken"); // Get token from local storage
      const response = await axios.get(`${API_BASE_URL}/tournament_user/${id}/`, {
        headers: {
          Authorization: `Token ${token}`, // Add token to headers
        },
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error("Échec de la récupération du tournoi");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
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


  if (loading) return <div className="w-full flex justify-center items-center min-h-[300px]">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
</div>;

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
         <p className=" text-(--textlight)"><span className="text-(--textwhite) font-bold">Date limite d'inscription:</span>  {tournament.registration_deadline
    ? formatDateTime(tournament.registration_deadline)
    : "Not Set"} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Frais d'inscription:</span> {tournament?.registration_fee}€</p>
       
        </div>
        <div className="text-end">
        <button 
         onClick={() => setShowModal(true)} 
         className={`py-2 px-5 rounded ${tournament?.is_registered ? "bg-gray-500 cursor-not-allowed" : "bg-(--accent)"}`}
         disabled={tournament?.is_registered}
        >
    {tournament?.is_registered ? "Déjà inscrit" : "S'inscrire"}
  </button>
        <div className=" text-white mt-3 px-3 py-1 rounded-lg">
        🏆 <span className="font-bold">Prix:</span>  {tournament.positions_1}€
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
          <h2 className="font-bold text-(--textwhite)">Catégorie</h2>
          <p className="text-(--textlight)">{tournament?.category}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Critères d'éligibilité</h2>
          <p className="text-(--textlight)">{tournament?.eligibility_criteria}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Pays</h2>
          <p className="text-(--textlight)">{tournament?.country}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Région</h2>
          <p className="text-(--textlight)">{tournament?.region}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Type de tournoi</h2>
          <p className="text-(--textlight)">{tournament?.bracket_type}</p>
        </div>
       
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="font-xl font-bold">Règles et règlements</h2>
      <p>{tournament?.rules_and_regulations}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Règles du match</h2>
      <p>{tournament?.match_rules}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Processus de résolution des litiges</h2>
      <p>{tournament?.dispute_resolution_Process}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Détails du parrainage</h2>
      <p>{tournament?.sponsorship_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Informations sur le partenariat</h2>
      <p>{tournament?.partnership_info}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Politique de remboursement</h2>
      <p>{tournament?.refund_policy}</p>
      </div>
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Distribution des prix</h2>
      <p>{tournament?.prize_distribution}</p>
      <hr className="my-5  border-(--border)"/>
      <h6 className="mt-2 font-bold">Gagnant</h6>
      <p>{tournament?.positions_1}€</p>
      <h6 className="mt-2 font-bold">Finaliste</h6>
      <p>{tournament?.positions_2}€</p>
     
      </div>
     
      <div className="grid md:grid-cols-2 gap-2">
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
         <h2 className="lemon-milk-font mb-4">Logo du sponsor</h2>
         <img src={tournament?.sponsor_logos} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
       
        <div className="">
      
       
        </div>      

      </div>
      <div className="text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Remarques :</h2>
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
     Code de conduite
   </a>
 ) : (
   <button 
     disabled 
     className="bg-gray-500 py-2 px-5 cursor-not-allowed rounded"
   >
     Code de conduite (indisponible)
   </button>
 )}
   <button 
          onClick={() => setShowModal(true)} 
          className={`py-2 px-5  rounded ${tournament?.is_registered ? "bg-gray-500  text-white cursor-not-allowed" : "bg-(--accent) text-white"}`}
          disabled={tournament?.is_registered}  >
         {tournament?.is_registered ? "Déjà inscrit" : "S'inscrire"}
        </button>
</div>
    
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-5 z-50 ">
          <div className="bg-(--primary) text-(--textwhite) rounded-lg shadow-lg w-96 relative p-6 overflow-y-auto  max-h-[80vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5">
              <IoMdCloseCircle />
            </button>
            {modalStep === "details" ? (
  <>
    <div className="text-left">
    <h2 className="font-bold mb-5 lemon-milk-font">Détails du tournoi</h2>
  
       <p ><strong>Frais:</strong> {tournament?.registration_fee} €</p>
    <p ><strong>Règles:</strong> {tournament?.rules_and_regulations}</p>
   
    <button onClick={() => setModalStep("checkout")} className="flex items-center gap-2 mt-4 px-4 py-2 bg-(--accent) text-white rounded">
    Procéder au paiement <span><FaArrowCircleRight /></span>
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
    <h2 className="font-bold mb-5 lemon-milk-font text-white text-center">Inscription réussie ! 🎉</h2>
    <p className="text-center">Merci de vous être inscrit au tournoi.</p>
   
  </>
)}

    </div>
  </div>
)}

    </>
  );
};

export default SingleTournament;
