import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import check from "../assets/images/check.png";
import alert from "../assets/images/alert.png";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" or "error"
  const [showPopup, setShowPopup] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Store the user's email

  const signup = async (formData) => {
    setLoading(true);
    setShowPopup(false); // Reset popup state

    try {
      const response = await axios.post(`${API_BASE_URL}/loge/register/`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setUserEmail(formData.email); // Save the email

      setPopupMessage(`
       <div style="text-align: center;">
           <img src="${check}" style="width:50px; padding-bottom:10px ;margin:auto;"/>
            <h2 class="lemon-milk-font" style="margin-bottom:15px;">Please verify your email</h2>
            <hr style="width:50%; border-color:#dedede; margin:auto; "/>
            <p style="padding-top:15px;">You’re almost there! We sent an email to</p>
            <p><strong>${formData.email}</strong></p>
            <p>Just click on the link in that email to complete your signup.<br/>If you don't see it, you may need to<strong> check your spam folder.</strong></p>          
        </div>
      `);

      setPopupType("success");
      setShowPopup(true);

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Something went wrong!";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (typeof errorData === "object") {
          const firstErrorKey = Object.keys(errorData)[0];
          errorMessage = Array.isArray(errorData[firstErrorKey])
            ? errorData[firstErrorKey][0]
            : errorData[firstErrorKey];
        }
      }
      setPopupMessage(`
        <div style="text-align: center;">
         
          <div style=" display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:10px;">
          <img src="${alert}" style="width:30px;"/>
           <h2 class="lemon-milk-font" style="">Error!</h2>
         </div>
          <p >${errorMessage}</p>
        </div>
      `);
      // setPopupMessage(errorMessage);
      setPopupType("error");
      setShowPopup(true);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

 

  return { signup, loading, popupMessage, popupType, showPopup, setShowPopup};
};

export default useSignup;
