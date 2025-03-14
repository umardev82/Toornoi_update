import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";


const useEditAthleteProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setError("Jeton d'authentification manquant. Veuillez vous connecter.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/loge/user/profile/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        const profileData = response.data;

        // Ensure full URL for profile image
        if (profileData.photo && !profileData.photo.startsWith("http")) {
          profileData.photo = `${API_BASE_URL}/${profileData.photo}`;
        }

        setProfile(profileData);
      })
      .catch(() => setError("Échec de la récupération du profil. Veuillez réessayer."));
  }, []);

  const updateProfile = async (formData) => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("userToken");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/loge/user/profile/update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let updatedProfile = response.data;

      // Ensure full image URL for the updated profile
      if (updatedProfile.photo && !updatedProfile.photo.startsWith("http")) {
        updatedProfile.photo = `${API_BASE_URL}/${updatedProfile.photo}`;
      }

      setProfile((prevProfile) => ({
        ...prevProfile,
        ...updatedProfile,
      }));

      // Use toast.promise to avoid duplicate notifications
      toast.promise(
        Promise.resolve("Profil mis à jour avec succès !"), 
        {
          loading: "Mise à jour du profil...",
          success: "Profil mis à jour avec succès !",
          error: "Échec de la mise à jour du profil. Réessayez.",
        }
      );

      setLoading(false);
      return { success: true };
    } catch (error) {
      // console.error("Update failed:", error);
      // setError("Failed to update profile. Please check required fields.");
      toast.error("Échec de la mise à jour du profil. Réessayez.");
      setLoading(false);
      return { success: false };
    }
  };

  return { profile, error, loading, updateProfile };
};

export default useEditAthleteProfile;
