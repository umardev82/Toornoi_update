import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaUserCheck, FaPhoneSquareAlt } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdEmail, MdDateRange } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import API_BASE_URL from "../config";

const AddAthlete = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    password: "",
    phone_number: "",
    is_verified: true,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const API_URL = `${API_BASE_URL}/users/`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "true" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await axios.post(API_URL, formData);
      toast.success("Athlete added successfully!");
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        email: "",
        password: "",
        phone_number: "",
        is_verified: true,
        is_active: true,
      });
    } catch (error) {
        if (error.response && error.response.data) {
          const errorMessages = Object.values(error.response.data).flat();
      
          if (errorMessages.length > 0) {
            toast.error(errorMessages[0], { duration: 4000 }); // Show only the first error
          }
        } else {
          toast.error("Failed to add athlete.");
        }
      }
       finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
     
      <div>
        <h1 className="lemon-milk-font text-(--textwhite) mb-4">Add New Athlete</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-7 bg-(--primary) md:p-7 p-4 rounded-md border border-(--border)">
            {/* Username */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <FaUserCheck /> Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* First Name */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <FaUserGear /> First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Last Name */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <FaUserGear /> Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Email */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <MdEmail /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Password */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <RiLockPasswordFill /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Date of Birth */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <MdDateRange /> Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Phone Number */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                <FaPhoneSquareAlt /> Phone Number
              </label>
              <input
                type="number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Is Verified */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                Is Verified
              </label>
              <select
                name="is_verified"
                value={formData.is_verified}
                onChange={handleSelectChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <hr className="border-(--border)" />

            {/* Is Active */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                Is Active
              </label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleSelectChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-(--accent) text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Athlete"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAthlete;
