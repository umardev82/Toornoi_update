import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/toornoi-logo.png";
import trophy from "../assets/images/trophy.png";
import { Toaster, toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setLocalError("Please fill in all fields.");
      return;
    }

    const toastId = toast.loading("Sending message...");

    try {
      const response = await axios.post(`${API_BASE_URL}/contact/`, {
        name,
        email,
        message,
      });
      
      toast.success(response.data.message || "Message sent successfully!", { id: toastId });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Something went wrong. Please try again.", { id: toastId });
      } else {
        toast.error("Network error. Please try again later.", { id: toastId });
      }
    }
  };

  return (
    <>
      <Toaster  toastOptions={{ duration: 5000 }} />
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
        <main id="content" className="w-full max-w-md mx-auto py-10">
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" className="mx-auto block" />
          </Link>
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-white">Contactez-nous</h1>
              <p className="text-(--textlight)">Nous serions ravis de vous entendre. Envoyez-nous un message !</p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2 text-(--textlight)">Nom</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Entrez votre nom"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 text-(--textlight)">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Entrez votre e-mail"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm mb-2 text-(--textlight)">Message</label>
                    <textarea
                      id="message"
                      placeholder="Entrez votre message"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {localError && <p className="text-red-500 text-sm">{localError}</p>}

                  <button
                    type="submit"
                    className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent border-(--accent) border transition-all"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <div className="hidden lg:block h-full">
          <img src={trophy} alt="logo" className="w-full h-screen object-cover" />
        </div>
      </div>
    </>
  );
};

export default Contact;
