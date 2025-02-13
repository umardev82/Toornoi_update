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
    status: "Pending",
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
    positions_3: "",
    sponsorship_details: "",
    sponsor_logos: null,
    partnership_info: "",
    refund_policy: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
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
      <Toaster />
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Add Tournaments</h1>
      <form onSubmit={handleSubmit} className="p-5 bg-(--primary) rounded-lg border border-(--border) ">
        <div className="grid md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
      <label className=" text-(--textwhite)">Tournament name</label>
        <input type="text" name="tournament_name" value={formData.tournament_name} onChange={handleChange} placeholder="Tournament Name" className="w-full bg-(--secondary) text-white p-3 rounded-md" required/>
        </div>
       <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Bracket Type</label>
        <input type="text" name="bracket_type" value={formData.bracket_type} onChange={handleChange} placeholder="Bracket Type" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Country</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Region</label>
        <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Region" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Registration Fee</label>
        <input type="number" name="registration_fee" value={formData.registration_fee} onChange={handleChange} placeholder="Registration Fee (€)" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Slots</label>
        <input type="number" name="slots" value={formData.slots} onChange={handleChange} placeholder="Slots" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Status</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Registration Deadline</label>
        <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Start Date</label>
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">End Date</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Time</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Cover Image</label>
        <input type="file" name="cover_image" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Sponsor Logos</label>
        <input type="file" name="sponsor_logos" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Code Of Conduct</label>
        <input type="file" name="code_of_conduct" onChange={handleChange} className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2"> 
        <label className=" text-(--textwhite)">Eligibility Criteria</label>
        <textarea name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleChange} placeholder="Eligibility Criteria" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Rules and Regulations</label>
        <textarea name="rules_and_regulations" value={formData.rules_and_regulations} onChange={handleChange} placeholder="Rules and Regulations" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Match Rules</label>
        <textarea name="match_rules" value={formData.match_rules} onChange={handleChange} placeholder="Match Rules" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Prize Details</label>
        <textarea name="prize_details" value={formData.prize_details} onChange={handleChange} placeholder="Prize Details" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Dispute Resolution Process</label>
        <textarea name="dispute_resolution_Process" value={formData.dispute_resolution_Process} onChange={handleChange} placeholder="Dispute Resolution Process" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Prize Distribution</label>
        <textarea name="prize_distribution" value={formData.prize_distribution} onChange={handleChange} placeholder="Prize Distribution" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Position 1</label>
        <textarea name="positions_1" value={formData.positions_1} onChange={handleChange} placeholder="Position 1" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Position 2</label>
        <textarea name="positions_2" value={formData.positions_2} onChange={handleChange} placeholder="Position 2" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
         <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Position 3</label>
        <textarea name="positions_3" value={formData.positions_3} onChange={handleChange} placeholder="Position 3" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Sponsorship Details</label>
        <textarea name="sponsorship_details" value={formData.sponsorship_details} onChange={handleChange} placeholder="Sponsorship Details" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Partnership Info</label>
        <textarea name="partnership_info" value={formData.partnership_info} onChange={handleChange} placeholder="Partnership Info" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
        <label className=" text-(--textwhite)">Refund Policy</label>
        <textarea name="refund_policy" value={formData.refund_policy} onChange={handleChange} placeholder="Refund Policy" className="w-full bg-(--secondary) text-white p-3 rounded-md" />
        </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-(--accent) mt-5 text-white rounded">Add Tournament</button>
      </form>
    </>
  );
};

export default AddTournament;
