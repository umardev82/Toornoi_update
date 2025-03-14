import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from "react-hot-toast";
import check from "../assets/images/check.png";
import alert from "../assets/images/alert.png";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); 
  const [popupType, setPopupType] = useState(""); 
  const [showPopup, setShowPopup] = useState(false);
  const [userEmail, setUserEmail] = useState(""); 

  const resendVerificationEmail = async () => {
    if (!userEmail) return;
  
    const toastId = toast.loading("Renvoi du courrier électronique...");
  
    try {
      await axios.post(`${API_BASE_URL}/loge/resend-verification-email/`, { email: userEmail });
      toast.success("L'e-mail de vérification a été renvoyé ! 📩", { id: toastId });
    } catch (error) {
      toast.error("Erreur lors du renvoi de l'e-mail. Veuillez réessayer.", { id: toastId });
    }
  };
  
  const signup = async (formData) => {
    setLoading(true);
    setShowPopup(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/loge/register/`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setUserEmail(formData.email);

      setPopupMessage(`
        <div style="text-align: center;">
          <img src="${check}" style="width:50px; padding-bottom:10px; margin:auto;" />
          <h2 class="lemon-milk-font" style="margin-bottom:15px;">Veuillez vérifier votre email!</h2>
          <hr style="width:50%; border-color:#dedede; margin:auto;" />
          <p style="padding-top:15px;">Vous y êtes presque ! Nous avons envoyé un e-mail à</p>
          <p><strong>${formData.email}</strong></p>
          <p>Cliquez simplement sur le lien dans cet e-mail pour terminer votre inscription. </p>  
          <p>Si vous ne le voyez pas, vous devrez peut-être vérifier votre dossier spam.</p>  
          <p>Vous ne trouvez toujours pas l'e-mail ?</p>   

          <button onclick="window.resendVerificationEmail()" class="mt-4 px-4 py-2 bg-(--accent) text-white rounded ">
            Renvoyer l'e-mail
          </button>
        </div>
      `);

      setPopupType("success");
      setShowPopup(true);

      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = "Quelque chose s'est mal passé !";
      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = typeof errorData === "string" ? errorData : Object.values(errorData)[0];
      }

      setPopupMessage(`
        <div style="text-align: center;">
          <div style="display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:10px;">
            <img src="${alert}" style="width:30px;"/>
            <h2 class="lemon-milk-font">Erreur!</h2>
          </div>
          <p>${errorMessage}</p>
        </div>
      `);

      setPopupType("error");
      setShowPopup(true);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Expose the function globally for inline button onclick
  window.resendVerificationEmail = resendVerificationEmail;

  return { signup, loading, popupMessage, popupType, showPopup, setShowPopup };
};

export default useSignup;
