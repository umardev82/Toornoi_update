import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import userImg from "../assets/images/userImg.png";
import VsImg from "../assets/images/vs.png";
import User1 from "../assets/images/user-1.png";
import User2 from "../assets/images/user-2.png";

const Chat = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMatchDetails();
    fetchUserProfile();
  }, []);

  const fetchMatchDetails = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("No authentication token found!");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/user/matches/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMatch(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching match details:", error.response?.data || error.message);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to fetch match details.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setErrorMessage("You need to be logged in to view the chat.");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/loge/user/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCurrentUser(response.data.username);
      fetchMessages();
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to load user profile.");
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/matches/${id}/chats/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setMessages(response.data);
      setLoading(false);
      scrollToBottom();
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to load chat messages.");
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setErrorMessage("You need to be logged in to send messages.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/matches/${id}/chats/`,
        { message: newMessage },
        {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to send message.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    
  

    <div className="text-white my-5 rounded-lg w-full">
      {/* Show error message if user is not authenticated */}
      {errorMessage ? (
        <p className="text-red-500 text-center p-5 rounded bg-(--primary)">{errorMessage}</p>
      ) : (
        <div className="bg-(--primary) md:p-8 p-3 rounded-lg">
         {!match ? (
  <p>Loading match details...</p>
) : (
 
     <div className="flex justify-center gap-3 items-center md:pb-5 pb-3">
            <div className="flex flex-col items-center">
              <img src={match.player_1_photo || User1} alt="Player 1" className="w-10 h-10 object-cover rounded-lg" />
              <p className="text-lg font-semibold">{match.player_1 || "Player 1"}</p>
            </div>
            <div>
              <img src={VsImg} alt="" className="w-10" />
            </div>
            <div className="flex flex-col items-center">
              <img src={match.player_2_photo || User2} alt="Player 2" className="w-10 h-10 object-cover rounded-lg" />
              <p className="text-lg font-semibold">{match.player_2 || "Player 2"}</p>
          
          </div>
  </div>
)}

          <div className="border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto bg-black">
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex gap-2 items-end ${
                    msg.sender === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== currentUser && (
                    <img src={msg.sender_photo || userImg} alt="" className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender === currentUser
                        ? "bg-(--accent) text-white text-right"
                        : "bg-gray-700 text-white text-left"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                  {msg.sender === currentUser && (
                    <img src={msg.sender_photo || userImg} alt="" className="w-8 h-8 rounded-full object-cover" />
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-700 text-white p-2 rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-(--accent) px-4 py-2 rounded text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Chat;
