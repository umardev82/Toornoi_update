import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

export const useTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tournaments
  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/`);
      setTournaments(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch tournaments", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single tournament
  const getTournament = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tournaments/${id}/`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch tournament", { duration: 5000 });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Extract and display backend error messages
  const handleErrorResponse = (err) => {
    if (err.response?.data) {
      const errorData = err.response.data;
      const errors = Object.entries(errorData).map(([key, value]) => `${key}: ${value[0]}`);
      const firstErrorMessage = errors[0] || "An error occurred";
  
      toast.error(firstErrorMessage, { duration: 5000 });
      return firstErrorMessage;
    }
    return "An error occurred";
  };
  
  // Add tournament
  const addTournament = async (tournamentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/tournaments/`, tournamentData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTournaments((prev) => [...prev, response.data]);
      toast.success("Tournament added successfully!", { duration: 5000 });
    } catch (err) {
      setError(handleErrorResponse(err));
    } finally {
      setLoading(false);
    }
  };

  // Edit tournament
  const editTournament = async (id, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_BASE_URL}/tournaments/${id}/`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTournaments((prev) =>
        prev.map((tournament) => (tournament.id === id ? response.data : tournament))
      );

      toast.success("Tournament updated successfully!", { duration: 5000 });
    } catch (err) {
      setError(handleErrorResponse(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, loading, error, fetchTournaments, getTournament, addTournament, editTournament };
};
