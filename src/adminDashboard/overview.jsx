import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'; // No need for DoughnutElement
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
  const { totalAthletes, totalTournaments,pendingCount,totalPaidAmount,totalPositions,totalClaim, loading, error } = useDashboardStats();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const activeMatches = 12;
  const totalIncome = "$10,000";
  const totalPrizes = "$5,000";
  const totalClaims = 30;

  // Example graph data with prominent white colors
  const athleteTournamentGraphData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Total Athletes',
        data: [1000, 1100, 1200, 1300],
        fill: false,
        borderColor: '#ffffff', // White for border
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter background
        tension: 0.1,
        pointBackgroundColor: '#ffffff', // White points
        pointBorderColor: '#ffffff', // White border for points
      },
      {
        label: 'Total Tournaments',
        data: [35, 38, 42, 45],
        fill: false,
        borderColor: '#f0f0f0', // Lighter white for contrast
        backgroundColor: 'rgba(240, 240, 240, 0.2)',
        tension: 0.1,
        pointBackgroundColor: '#f0f0f0',
        pointBorderColor: '#f0f0f0',
      },
    ],
  };

  const incomePrizeGraphData = {
    labels: ['Income', 'Prizes'],
    datasets: [
      {
        data: [10000, 5000],
        backgroundColor: ['#ffffff', '#d6d6d6'], // White for income, lighter white for prizes
        borderColor: '#ffffff', // White border for doughnut chart
        borderWidth: 2, // Increased border width for contrast
        
      },
    ],
  };

  return (
 
      <div className="container mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <FaPersonRunning  className='w-10 text-3xl text-(--textwhite)'/>
            <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total Athletes</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{totalAthletes}</p>
            </div>           
          </div>
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <HiMiniTrophy  className='w-10 text-3xl text-(--textwhite)'/>
          <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total Tournaments</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{totalTournaments}</p>
            </div>
          </div>
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <CgGames  className='w-10 text-3xl text-(--textwhite)'/>
            <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Active Matches</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{pendingCount}</p>
            </div>
          </div>
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <GrCurrency  className='w-10 text-3xl text-(--textwhite)'/>
            <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total Income</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{totalPaidAmount}</p>
            </div>
          </div>
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <GiTargetPrize  className='w-10 text-3xl text-(--textwhite)'/>
            <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total Prizes</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{totalPositions}</p>
            </div>
          </div>
          <div className="card flex gap-x-3 bg-(--primary) p-6 rounded-lg border border-(--border)">
          <FaUserShield  className='w-10 text-3xl text-(--textwhite)'/>
            <div>
            <h2 className="lemon-milk-medium text-(--textwhite)">Total Claims</h2>
            <p className="text-xl lemon-milk-medium text-(--textwhite) ">{totalClaim}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-(--primary) p-6 rounded-lg border border-(--border) h-full">
            <h2 className="text-xl mb-4 text-(--textwhite) text-center">Athletes and Tournaments Over Time</h2>
            <hr className='mb-4  border-(--border)'/>
            <Line data={athleteTournamentGraphData} options={{ responsive: true }} />
          </div>

          <div className="bg-(--primary) p-6 rounded-lg border border-(--border) h-full">
            <h2 className="text-xl text-(--textwhite) mb-4 text-center">Income vs Prizes</h2>
            <hr className='mb-4  border-(--border)'/>
            <Pie data={incomePrizeGraphData} />
          </div>
        </div>
      </div>
   
  );
};

export default Overview;
