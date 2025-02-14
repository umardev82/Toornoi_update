import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaUserCheck, FaPhoneSquareAlt } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdEmail, MdDateRange } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import API_BASE_URL from "../config";
import { useParams } from "react-router-dom";

const EditAthlete = () => {
  const { id } = useParams(); // Get athlete ID from URL
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
  const API_URL = `${API_BASE_URL}/users/${id}/`;

  // Fetch existing athlete data
  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const response = await axios.get(API_URL);
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to fetch athlete data.");
      }
    };
    fetchAthlete();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_verified" || name === "is_active") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(API_URL, formData);
      toast.success("Athlete updated successfully!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to update athlete. Please check the details.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div>
      <h1 className="lemon-milk-font text-(--textwhite) mb-4">Edit Athlete</h1>
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
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
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
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
            <hr className="border-(--border)" />

            {/* Verified Dropdown */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                 Verified
              </label>
              <select
                name="is_verified"
                value={formData.is_verified}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <hr className="border-(--border)" />

            {/* Active Dropdown */}
            <div className="md:flex flex-row justify-between text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs">
                Active
              </label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <hr className="border-(--border)" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-(--accent) text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Athlete"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditAthlete;
