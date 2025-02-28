import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("adminToken"); // Retrieve token

  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/loge/superadmin/profile/`, {
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
        setError("Authentication failed. Please check your token.");
      });
  }, [token]);

  return { profile, error };
};


export default useProfile;
