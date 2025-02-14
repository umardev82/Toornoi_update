import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalTournaments: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [athletesResponse, tournamentsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/total_user/`),
          axios.get(`${API_BASE_URL}/total_tournaments/`),
        ]);

        console.log('Athletes Response:', athletesResponse.data);
        console.log('Tournaments Response:', tournamentsResponse.data);

        setStats({
          totalAthletes: athletesResponse.data.total_users,
          totalTournaments: tournamentsResponse.data.total_tournaments,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalAthletes: 0,
          totalTournaments: 0,
          loading: false,
          error: error.message || 'Error fetching data',
        });
      }
    };

    fetchStats();
  }, []);

  return stats;
};

export default useDashboardStats;
