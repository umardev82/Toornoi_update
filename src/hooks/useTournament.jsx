import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

export const useTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tournaments
  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/`);
      setTournaments(response.data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };
  const getTournament = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/${id}/`);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch tournament");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add tournament
  const addTournament = async (tournamentData) => {
    setLoading(true);
    setError(null);
    const addPromise = axios.post(`${API_BASE_URL}/tournaments/`, tournamentData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return toast.promise(addPromise, {
      loading: "Adding tournament...",
      success: (res) => {
        setTournaments([...tournaments, res.data]);
        return "Tournament added successfully!";
      },
      error: (err) => {
        setError(err.response?.data?.detail || "Failed to add tournament");
        return err.response?.data?.detail || "Add failed!";
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  // Edit tournament
  const editTournament = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    const editPromise = axios.put(`${API_BASE_URL}/tournaments/${id}/`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return toast.promise(editPromise, {
      loading: "Updating tournament...",
      success: "Tournament updated successfully!",
      error: "Failed to update tournament",
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return { tournaments, loading, error, fetchTournaments, getTournament, addTournament, editTournament };
};
