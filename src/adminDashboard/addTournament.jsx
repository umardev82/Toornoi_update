// AddTournament.jsx
import { useState } from "react";
import { useTournament } from "../hooks/useTournament";
import { Toaster } from "react-hot-toast";

const AddTournament = () => {
  const { addTournament } = useTournament();
  const [formData, setFormData] = useState({
    tournament_name: "",
    description: "",
    cover_image: null,
    category: "",
    registration_deadline: "",
    registration_fee: "",
    slots: "",
    status: "",
    start_date: "",
    end_date: "",
    time: "",
    bracket_type: "",
    eligibility_criteria: "",
    country: "",
    region: "",
    rules_and_regulations: "",
    code_of_conduct: null,
    match_rules: "",
    prize_details: "",
    dispute_resolution_Process: "",
    prize_distribution: "",
    positions_1: "",
    positions_2: "",
    // positions_3: "",
    sponsorship_details: "",
    sponsor_logos: null,
    partnership_info: "",
    refund_policy: "",
    is_publish: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    await addTournament(formDataToSend);
  };

  return (
    <>
     {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Ajouter des tournois</h1>
      <form onSubmit={handleSubmit} className="p-5 bg-(--primary) rounded-lg border border-(--border) ">
        <div className="grid md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
      <label className=" text-(--textwhite)">Nom du tournoi
</label>
        <input type="text" name="tournament_name" value={formData.tournament_name} onChange={handleChange} placeholder="Nom du tournoi
" className="w-full bg-(--secondary) text-white p-3 rounded-md" required/>
        </div>
       <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Catégorie</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Catégorie" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Type de tournoi</label>
        <input type="text" name="bracket_type" value={formData.bracket_type} onChange={handleChange} placeholder="Type de tournoi" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Pays</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Pays" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Région</label>
        <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Région" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Frais d'inscription</label>
        <input type="number" name="registration_fee" value={formData.registration_fee} onChange={handleChange} placeholder="Frais d'inscription (€)" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Machines à sous</label>
        <input type="number" name="slots" value={formData.slots} onChange={handleChange} placeholder="Machines à sous" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className="text-(--textwhite)">Statut</label>
        <select name="status"  value={formData.status} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" >
        <option value="Open">Ouvrir</option>
        <option value="In Progress">En cours</option>
        <option value="Completed">Complété</option>
        </select>
        </div>

        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Date limite d'inscription</label>
        <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Date de début</label>
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Date de fin</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Temps
        </label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Image de couverture</label>
        <input type="file" name="cover_image" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Logo du sponsor</label>
        <input type="file" name="sponsor_logos" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Code de conduite</label>
        <input type="file" name="code_of_conduct" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2"> 
        <label className=" text-(--textwhite)">Critères d'éligibilité</label>
        <textarea name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleChange} placeholder="Critères d'éligibilité" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Règles et règlements</label>
        <textarea name="rules_and_regulations" value={formData.rules_and_regulations} onChange={handleChange} placeholder="Règles et règlements" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Règles du match</label>
        <textarea name="match_rules" value={formData.match_rules} onChange={handleChange} placeholder="Règles du match" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Détails du prix</label>
        <textarea name="prize_details" value={formData.prize_details} onChange={handleChange} placeholder="Détails du prix" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Processus de résolution des litiges</label>
        <textarea name="dispute_resolution_Process" value={formData.dispute_resolution_Process} onChange={handleChange} placeholder="Processus de résolution des litiges" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Distribution des prix</label>
        <textarea name="prize_distribution" value={formData.prize_distribution} onChange={handleChange} placeholder="Distribution des prix" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Gagnant</label>
        <input type="number" name="positions_1" value={formData.positions_1} onChange={handleChange} placeholder="Prix ​​(€)" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Finaliste</label>
        <input type="number" name="positions_2" value={formData.positions_2} onChange={handleChange} placeholder="Prix ​​(€)" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         {/* <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Position 3</label>
        <textarea name="positions_3" value={formData.positions_3} onChange={handleChange} placeholder="Position 3" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div> */}
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Détails du parrainage</label>
        <textarea name="sponsorship_details" value={formData.sponsorship_details} onChange={handleChange} placeholder="Détails du parrainage
" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Informations sur le partenariat</label>
        <textarea name="partnership_info" value={formData.partnership_info} onChange={handleChange} placeholder="Informations sur le partenariat" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Politique de remboursement</label>
        <textarea name="refund_policy" value={formData.refund_policy} onChange={handleChange} placeholder="Politique de remboursement" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_publish"
              checked={formData.is_publish}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-(--textwhite)">Publier le tournoi</label>
          </div>

        </div>
        <button type="submit" className="px-4 py-2 bg-(--accent) mt-5 text-white rounded">Add Tournament</button>
      </form>
    </>
  );
};

export default AddTournament;
