import { useState } from "react";
import useEditProfile from "../hooks/useEditProfile";
import { FaUserCheck } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdImportantDevices } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import profileUpload from "../assets/images/uploadimage.png";
import { Toaster, toast } from "react-hot-toast";

const EditProfile = () => {
  const { profile, error, loading, updateProfile } = useEditProfile();
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center mt-10 text-white">Loading...</div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if there are any changes
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] && formData[key] !== profile[key]
    );
  
    if (!hasChanges) {
      toast("Your profile is already up to date!");
      return;
    }
  
    const updatedData = new FormData();
    updatedData.append("username", formData.username || profile.username);
    updatedData.append("email", formData.email || profile.email);
    updatedData.append("first_name", formData.first_name || profile.first_name);
    updatedData.append("last_name", formData.last_name || profile.last_name);
    updatedData.append("phone_number", formData.phone_number || profile.phone_number);
    updatedData.append("location", formData.location || profile.location);
    updatedData.append("date_of_birth", formData.date_of_birth || profile.date_of_birth);
    updatedData.append("password", formData.password || profile.password);
    
    if (formData.photo) {
      updatedData.append("photo", formData.photo);
    }
  
    // Call updateProfile (toast is handled inside useEditProfile)
    await updateProfile(updatedData);
  };
  

  return (
    <>
      <Toaster />
      <div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-7 bg-(--primary) md:p-7 p-4 rounded-md border border-(--border)">
          {/* Username */}
          <div className="md:flex flex-row justify-between text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><FaUserCheck />Username</label>
            <input
              type="text"
              name="username"
              defaultValue={profile.username}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
              required
            />
          </div>
           <hr  className="border-(--border)"/>
          {/* Full Name */}
          
            <div className="md:flex flex-row justify-between  text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><FaUserGear />First Name</label>
              <input
                type="text"
                name="first_name"
                defaultValue={profile.first_name}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
             <hr  className="border-(--border)"/>
            <div className="md:flex flex-row justify-between  text-nowrap">
              <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><FaUserGear />Last Name</label>
              <input
                type="text"
                name="last_name"
                defaultValue={profile.last_name}
                onChange={handleChange}
                className="w-full bg-(--secondary) text-white p-3 rounded-md"
                required
              />
            </div>
             <hr  className="border-(--border)"/>
          

          {/* Email */}
          <div className="md:flex flex-row justify-between  text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><MdEmail />Email</label>
            <input
              type="email"
              name="email"
              defaultValue={profile.email}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
              required
            />
          </div>
          <hr  className="border-(--border)"/>
          {/* Password (Optional for Updates) */}
          <div className="md:flex flex-row justify-between  text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><RiLockPasswordFill />Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password (leave blank to keep current)"
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>
           <hr  className="border-(--border)"/>
          {/* Date of Birth */}
          <div className="md:flex flex-row justify-between  text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><MdDateRange />Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              defaultValue={profile.date_of_birth}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
              required
            />
          </div>
           <hr  className="border-(--border)"/>
          {/* Phone */}
          <div className="md:flex flex-row justify-between  text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><FaPhoneSquareAlt />Phone Number</label>
            <input
              type="text"
              name="phone_number"
              defaultValue={profile.phone_number}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
              required
            />
          </div>
           <hr  className="border-(--border)"/>

          {/* Location */}
          <div className="md:flex flex-row justify-between  text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><FaLocationDot />Location</label>
            <input
              type="text"
              name="location"
              defaultValue={profile.location || ""}
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>
           <hr  className="border-(--border)"/>
          
          {/* Profile Photo */}
          <div className="md:flex flex-row   text-nowrap">
            <label className="flex items-center gap-x-2 md:mb-0 mb-2 text-(--textwhite) min-w-3xs"><ImProfile />Profile Photo</label>
          
            <div className="flex items-center justify-center space-x-4 w-full bg-(--secondary) text-white p-3 rounded-md">
            
             <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                <img src={photoPreview || profile.photo || profileUpload } alt="" className="w-24 h-24 object-cover rounded-full border border-black mb-4"/>
          <p className="text-white">Click to upload or drag and drop</p>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <p className="text-gray-400 text-sm mt-2">SVG, PNG, JPG, GIF (max. 800x400px)</p>
        </label>
            </div>
          </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className=" bg-(--accent) text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
