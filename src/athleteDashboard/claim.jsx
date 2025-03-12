import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";

const ClaimPage = () => {
  const [formData, setFormData] = useState({
    phone_number: "",
    subject: "",
    details: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      toast.error("User not authenticated");
      return;
    }

    axios
      .get(`${API_BASE_URL}/loge/user/profile/`, {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((response) => {
        setFormData((prev) => ({
          ...prev,
          phone_number: response.data.phone_number, // Fetch phone number from response
        }));
      })
      .catch((error) => {
        console.error("Error fetching user phone number:", error);
        toast.error("Failed to load user data");
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] }); // Handle file upload
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    // Create FormData for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("details", formData.details);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    const claimPromise = axios.post(`${API_BASE_URL}/claims/`, formDataToSend, {
      headers: {
        Authorization: `Token ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    toast.promise(claimPromise, {
      loading: "Submitting your support ticket...",
      success: (response) => {
        setFormData({ phone_number: formData.phone_number, subject: "", details: "", image: null }); // Reset form except phone number
        return response.data.message || " Support Ticket submitted successfully!";
      },
      error: (error) => error.response?.data?.message || "Failed to submit support ticket",
    }).finally(() => setLoading(false));
  };

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-(--primary) text-(--textwhite) shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit a Support Ticket</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="phone_number" value={formData.phone_number} />

          <div className="mb-4">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          <div className="mb-4">
            <textarea
              name="details"
              placeholder="Details"
              value={formData.details}
              onChange={handleChange}
              required
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          <div className="mb-4">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-(--secondary) text-white p-3 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-(--accent) text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Support Ticket"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ClaimPage;
