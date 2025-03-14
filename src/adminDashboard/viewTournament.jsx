import { useState, useEffect, useCallback } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";

const ViewTournament = () => {
  const { id } = useParams();
  const { getTournament } = useTournament();
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Function to format date as DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid dates
  return date.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
};

// Function to format date with time as DD/MM/YYYY - HH:MM
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid dates
  return `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
};


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
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Date: </span> 
        {tournamentData.start_date && tournamentData.end_date
    ? `${formatDate(tournamentData.start_date)} - ${formatDate(tournamentData.end_date)}`
    : "Not Set"}</p>
         <p className=" text-(--textlight)"><span className="text-(--textwhite) font-bold">Date limite d'inscription: </span> 
         {tournamentData.registration_deadline
    ? formatDateTime(tournamentData.registration_deadline)
    : "Not Set"} </p>
        <p className="text-(--textlight)"><span className="text-(--textwhite) font-bold">Frais d'inscription:</span> {tournamentData?.registration_fee} €</p>
        </div>
        <div className="text-end">
          <button  className="p-2 bg-(--accent) rounded mr-2 text-sm" onClick={() => navigate(`/dashboard/tournaments/${tournamentData?.id}/registered-athletes`)}>
          Voir les athlètes inscrits
      </button>

        <button className="p-2 bg-yellow-700 rounded text-sm">{tournamentData?.status}</button>
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
          <h2 className="font-bold text-(--textwhite)">Catégorie</h2>
          <p className="text-(--textlight)">{tournamentData?.category}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Critères d'éligibilité</h2>
          <p className="text-(--textlight)">{tournamentData?.eligibility_criteria}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Pays</h2>
          <p className="text-(--textlight)">{tournamentData?.country}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Région</h2>
          <p className="text-(--textlight)">{tournamentData?.region}</p>
        </div>
        <div>
          <h2 className="font-bold text-(--textwhite)">Type de tournoi</h2>
          <p className="text-(--textlight)">{tournamentData?.bracket_type}</p>
        </div>
       
      </div>
      <div className="text-(--textwhite) mt-5 bg-(--primary) p-5 rounded ">
      <h2 className="font-xl font-bold">Règles et règlements</h2>
      <p>{tournamentData?.rules_and_regulations}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Règles du match</h2>
      <p>{tournamentData?.match_rules}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Processus de résolution des litiges</h2>
      <p>{tournamentData?.dispute_resolution_Process}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Détails du parrainage</h2>
      <p>{tournamentData?.sponsorship_details}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Informations sur le partenariat</h2>
      <p>{tournamentData?.partnership_info}</p>
      <hr className="my-5  border-(--border)"/>
      <h2 className="font-xl font-bold">Politique de remboursement</h2>
      <p>{tournamentData?.refund_policy}</p>
      </div>
      <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Distribution des prix</h2>
      <p>{tournamentData?.prize_distribution}</p>
      <hr className="my-5  border-(--border)"/>
      <h6 className="mt-2 font-bold">Gagnant</h6>
      <p>{tournamentData?.positions_1}€</p>
      <h6 className="mt-2 font-bold">Finaliste</h6>
      <p>{tournamentData?.positions_2}€</p>
     
      </div>
      <div className="grid md:grid-cols-2 gap-2 ">
        <div className="bg-(--primary) p-5 rounded text-(--textwhite) mt-5">
         <h2 className="lemon-milk-font mb-4">Logo du sponsor</h2>
         <img src={tournamentData?.sponsor_logos} alt="" className="h-60 w-full rounded object-cover"/>
        </div>
      </div>
     
      <div className="text-(--textwhite) mt-5">
      <h2 className="lemon-milk-font">Remarques :</h2>
      <p className="italic">{tournamentData?.prize_details}</p>      
      </div>
   
        <div className=" text-(--textwhite) my-8 text-right">
 
  {tournamentData?.code_of_conduct ? (
    <a 
      href={tournamentData.code_of_conduct} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-(--accent) text-white px-5 py-3 rounded"
    >
      Code de conduite
    </a>
  ) : (
    <button 
      disabled 
      className="bg-gray-400 px-5 py-3 cursor-not-allowed rounded"
    >
      Code de conduite (indisponible)
    </button>
  )}
</div>


    </>
  );
};

export default ViewTournament;
