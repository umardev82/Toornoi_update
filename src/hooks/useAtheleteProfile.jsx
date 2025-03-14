import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const useAthleteProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken"); // Retrieve token

  useEffect(() => {
    if (!token) {
      setError("Jeton d'authentification manquant. Veuillez vous connecter.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/loge/user/profile/`, {
        headers: {
          Authorization: `Token ${token}`, // Attach token from localStorage
        },
      })
      .then((response) => {
        // Ensure photo URL is absolute
        const profileData = response.data;
        if (profileData.photo && !profileData.photo.startsWith("http")) {
          profileData.photo = `${API_BASE_URL}/${profileData.photo}`;
        }
        setProfile(profileData);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError("Échec de l'authentification. Veuillez vérifier votre jeton.");
      });
  }, [token]);

  return { profile, error };
};


export default useAthleteProfile;
