import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";
import { Toaster } from "react-hot-toast";

const EditTournament = () => {
    const { id } = useParams(); // Get the tournament ID from the route parameter
    const { getTournament, editTournament } = useTournament(); // Assuming updateTournament handles the update
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
    const [isFetched, setIsFetched] = useState(false); // To track if the data is already fetched
    const [preview, setPreview] = useState({});
    useEffect(() => {
      const fetchTournament = async () => {
        if (!isFetched) {
          try {
            const tournament = await getTournament(id);
            if (tournament) {
              setFormData((prevData) => ({
                ...prevData,
                ...tournament, // Merge with existing state
                registration_deadline: tournament.registration_deadline 
              ? new Date(tournament.registration_deadline).toISOString().slice(0, 16) // Convert to YYYY-MM-DDTHH:MM
              : "",
              }));
              setIsFetched(true); // Mark as fetched
            }
          } catch (error) {
            console.error("Error fetching tournament:", error);
          }
        }
      };
    
      fetchTournament();
    }, [id, getTournament, isFetched]); // Add isFetched to avoid continuous fetching

    const handleChange = (e) => {
      const { name, type, files } = e.target;
      
      if (type === "file" && files.length > 0) {
        const file = files[0];
        setFormData((prev) => ({
          ...prev,
          [name]: file, // Store the file object in formData
        }));
    
        // Create a preview URL
        setPreview((prev) => ({
          ...prev,
          [name]: URL.createObjectURL(file),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: e.target.value,
        }));
      }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          // Only append actual file objects, not URLs or null values
          if (key === "cover_image" || key === "code_of_conduct" || key === "sponsor_logos") {
            if (formData[key] instanceof File) {
              formDataToSend.append(key, formData[key]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
    
      await editTournament(id, formDataToSend);
    };
    
  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Modifier le tournoi</h1>
      <form onSubmit={handleSubmit} className="md:p-5 p-3 bg-(--primary) rounded-lg border border-(--border)">
        <div className="grid md:grid-cols-2 gap-3">
          {/* Tournament Name */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Nom du tournoi</label>
            <input
              type="text"
              name="tournament_name"
              value={formData.tournament_name}
              onChange={handleChange}
              placeholder="Nom du tournoi"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Catégorie</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Catégorie"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Registration Fee */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Frais d'inscription (€)</label>
            <input
              type="number"
              name="registration_fee"
              value={formData.registration_fee}
              onChange={handleChange}
              placeholder="Frais d'inscription (€)"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Machines à sous</label>
            <input
              type="number"
              name="slots"
              value={formData.slots}
              onChange={handleChange}
              placeholder="Machines à sous"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Status */}
         {/* Status Dropdown */}
<div className="flex flex-col gap-2">
  <label className="text-(--textwhite)">Statut</label>
  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="w-full bg-(--secondary) text-white p-3 rounded-md"
  >
        <option value="Open">Ouvrir</option>
        <option value="In Progress">En cours</option>
        <option value="Completed">Complété</option>
  </select>
</div>


          {/* Registration Deadline */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Date limite d'inscription</label>
            <input
              type="datetime-local"
              name="registration_deadline"
              value={formData.registration_deadline}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Date de début</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Date de fin</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Temps</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
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
        <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Region" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Eligibility Criteria */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Critères d'éligibilité</label>
            <textarea
              name="eligibility_criteria"
              value={formData.eligibility_criteria}
              onChange={handleChange}
              placeholder="Critères d'éligibilité"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Rules and Regulations */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Règles et règlements</label>
            <textarea
              name="rules_and_regulations"
              value={formData.rules_and_regulations}
              onChange={handleChange}
              placeholder="Règles et règlements"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Match Rules */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Règles du match</label>
            <textarea
              name="match_rules"
              value={formData.match_rules}
              onChange={handleChange}
              placeholder="Règles du match"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Prize Details */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Détails du prix</label>
            <textarea
              name="prize_details"
              value={formData.prize_details}
              onChange={handleChange}
              placeholder="Détails du prix"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Dispute Resolution Process */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Processus de résolution des litiges</label>
            <textarea
              name="dispute_resolution_Process"
              value={formData.dispute_resolution_Process}
              onChange={handleChange}
              placeholder="Processus de résolution des litiges"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Prize Distribution */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Distribution des prix</label>
            <textarea
              name="prize_distribution"
              value={formData.prize_distribution}
              onChange={handleChange}
              placeholder="Distribution des prix"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Position 1 */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Gagnant</label>
            <input
              type="number"
              name="positions_1"
              value={formData.positions_1}
              onChange={handleChange}
              placeholder="Prix ​​(€)"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Position 2 */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Finaliste</label>
            <input
              type="number"
              name="positions_2"
              value={formData.positions_2}
              onChange={handleChange}
              placeholder="Prix ​​(€)"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Position 3 */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Position 3</label>
            <textarea
              type="text"
              name="positions_3"
              value={formData.positions_3}
              onChange={handleChange}
              placeholder="Position 3 Prize"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div> */}

          {/* Sponsorship Details */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Détails du parrainage</label>
            <textarea
              name="sponsorship_details"
              value={formData.sponsorship_details}
              onChange={handleChange}
              placeholder="Détails du parrainage"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Partnership Information */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Informations sur le partenariat</label>
            <textarea
              name="partnership_info"
              value={formData.partnership_info}
              onChange={handleChange}
              placeholder="Informations sur le partenariat"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          {/* Refund Policy */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Politique de remboursement</label>
            <textarea
              name="refund_policy"
              value={formData.refund_policy}
              onChange={handleChange}
              placeholder="Politique de remboursement"
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>
          
          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Image de couverture</label>
            <input
              type="file"
              name="cover_image"
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
            {formData.cover_image && typeof formData.cover_image === "string" && (
           <img src={formData.cover_image} alt="Cover" className="w-20 h-20 object-cover" />
             )}
                             {preview.cover_image && (
    <img src={preview.cover_image} alt="Cover" className="w-20 h-20 object-cover rounded-md mt-2" />
  )}
           
          </div>

          {/* Sponsor Logos */}
          <div className="flex flex-col gap-2">
            <label className="text-(--textwhite)">Logo du sponsor</label>
            <input
              type="file"
              name="sponsor_logos"
              multiple
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
             {formData.sponsor_logos && typeof formData.sponsor_logos === "string" && (
          <img src={formData.sponsor_logos} alt="Sponsor Logo" className="w-20 h-20 object-cover" />
              )}
                {preview.sponsor_logos && (
    <img src={preview.sponsor_logos} alt="Sponsor Logo" className="w-20 h-20 object-cover rounded-md mt-2" />
  )}
          </div>

       {/* Code Of Conduct */}
<div className="flex flex-col gap-2">
  <label className="text-(--textwhite)">Code de conduite</label>
  <input
    type="file"
    name="code_of_conduct"
    accept="image/*"
    onChange={handleChange}
    className="w-full bg-(--secondary) text-white p-3 rounded-md"
  />
  
  {/* Show the existing image if available */}
  {formData.code_of_conduct && typeof formData.code_of_conduct === "string" && (
    <img src={formData.code_of_conduct} alt="Code Of Conduct" className="w-20 h-20 object-cover rounded-md mt-2" />
  )}

  {/* Show the newly selected image preview */}
  {preview.code_of_conduct && (
    <img src={preview.code_of_conduct} alt="New Code Of Conduct" className="w-20 h-20 object-cover rounded-md mt-2" />
  )}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-(--accent) text-white py-2 px-4 rounded mt-4 w-full"
        >
          Tournoi de mise à jour
        </button>
      </form>
    </>
  );
};

export default EditTournament;
