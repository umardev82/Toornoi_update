import useProfile from "../hooks/useProfile";
import userProfileImage from "../assets/images/profile.png";
import userProfileCover from "../assets/images/profile-bg.png";
console.log("Fallback Image:", userProfileImage);
import { FaUser } from "react-icons/fa";
import { Link } from "react-router";

const Profile = () => {
  const { profile, error } = useProfile();

  
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
   
      <>
        {/* Cover Photo */}
        <div className="h-44">
         <img src={userProfileCover} alt="" className="w-full h-full object-cover  rounded-lg" />
        </div>

        {/* Profile Info */}
        <div className="text-center md:flex md:pl-5 ">
            <div className="sm:min-w-36 ">
            <img
              src={profile.photo || userProfileImage }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 -mt-16"
            />
            </div>
            <div className="w-full flex justify-between py-5">
                <div className="text-left">
          <h2 className="text-2xl font-semibold text-(--textwhite)">{profile.first_name} {profile.last_name}</h2>
          <p className="text-gray-400">{profile.email}</p></div>
          <div className="md:pt-0 pt-11">
          <Link to="/dashboard/settings" className="md:mt-3 px-4 py-2 bg-(--accent) text-(--textwhite) rounded-md">
          Modifier le profil
          </Link>
          </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 ">
          <h3 className="text-lg flex items-center border-b border-(--border) pb-4 gap-2 text-(--textwhite)"><FaUser /><span>Détails personnels</span></h3>
          <div className="mt-4 grid grid-cols-2 gap-3 space-y-3">
            <div className="flex flex-col gap-0 text-(--textwhite)">
              <p className="font-bold">Nom et prénom:</p>
              <p className="text-(--textlight)">{profile.first_name} {profile.last_name}</p>
            </div>
            <div className="flex flex-col gap-0 text-(--textwhite)">
              <p className="font-bold">E-mail:</p>
              <p className="text-(--textlight)">{profile.email}</p>
            </div>
            <div className="flex flex-col gap-0 text-(--textwhite)">
              <p className="font-bold">Date de naissance:</p>
              <p className="text-(--textlight)">{profile.date_of_birth}</p>
            </div>
            <div className="flex flex-col gap-0 text-(--textwhite)">
              <p className="font-bold">Téléphone:</p>
              <p className="text-(--textlight)">{profile.phone_number}</p>
            </div>
            <div className="flex flex-col gap-0 text-(--textwhite)">
              <p className="font-bold">Emplacement:</p>
              <p className="text-(--textlight)">{profile.location || "Not provided"}</p>
            </div>
            
          </div>
        </div>
        </>
  
  );
};

export default Profile;
