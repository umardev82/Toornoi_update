import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FaPersonRunning } from "react-icons/fa6";
import { HiMiniTrophy } from "react-icons/hi2";
import { CgGames } from "react-icons/cg";
import { GrCurrency } from "react-icons/gr";
import { GiTargetPrize } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa";
import useDashboardStats from '../hooks/useDashboardStats';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // ArcElement for Pie chart
  PointElement,
  LineElement // Register the Line chart type
);

const Overview = () => {
  const { totalAthletes, totalTournaments, pendingCount, totalPaidAmount, totalPositions, totalClaim, loading, error } = useDashboardStats();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  // Dynamic data for the pie chart
  const incomePrizeGraphData = {
    labels: [' Revenu total ', 'Total des prix'],
    datasets: [
      {
        data: [totalPaidAmount, totalPositions], // Use dynamic data here
        backgroundColor: ['#36A2EB', '#ddd'], // Custom colors for income and prizes
        borderColor: '#ffffff', // White border for pie chart
        borderWidth: 2, // Border width for contrast
      },
    ],
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <FaPersonRunning className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total des athlètes</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{totalAthletes}</p>
          </div>
        </div>
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <HiMiniTrophy className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total des tournois</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{totalTournaments}</p>
          </div>
        </div>
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <CgGames className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Matchs actifs</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{pendingCount}</p>
          </div>
        </div>
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <GrCurrency className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total des revenus</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{totalPaidAmount}</p>
          </div>
        </div>
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <GiTargetPrize className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total des prix</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{totalPositions}</p>
          </div>
        </div>
        <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <FaUserShield className='w-10 text-3xl text-(--textwhite)' />
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total des réclamations</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite)">{totalClaim}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
          
        <div className="bg-(--primary) p-6 rounded-lg border border-(--border) h-full">
          <h2 className="text-xl text-(--textwhite) mb-4 text-center">Revenus vs prix</h2>
          <hr className='mb-4 border-(--border)' />
          <Pie data={incomePrizeGraphData} />
        </div>
      </div>
    </div>
  );
};

export default Overview;