import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalTournaments: 0,
    pendingCount: 0,
    totalPaidAmount: 0,
    totalPositions: 0,
    totalClaim: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          athletesResponse,
          tournamentsResponse,
          pendingCountResponse,
          totalPaidAmountResponse,
          totalPositionsResponse,
          totalClaimResponse
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/total_user/`),
          axios.get(`${API_BASE_URL}/total_tournaments/`),
          axios.get(`${API_BASE_URL}/matches/pending-count/`),
          axios.get(`${API_BASE_URL}/total-paid-amount/`),
          axios.get(`${API_BASE_URL}/total-positions/`),
          axios.get(`${API_BASE_URL}/total_claim/`),
        ]);

        setStats({
          totalAthletes: athletesResponse.data.total_users,
          totalTournaments: tournamentsResponse.data.total_tournaments,
          pendingCount: pendingCountResponse.data.Active_matches,
          totalPaidAmount: totalPaidAmountResponse.data.total_paid_amount,
          totalPositions: totalPositionsResponse.data.total_positions,
          totalClaim: totalClaimResponse.data.total_claim,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats((prevStats) => ({
          ...prevStats,
          loading: false,
          error: error.message || 'Error fetching data',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};

export default useDashboardStats;
