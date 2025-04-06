import React, { useEffect } from 'react';
import { Users, BookOpen, Star, DollarSign } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { backendRequest } from '@/Helper/backendRequest';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const stats = [
    { icon: BookOpen, label: 'Total Courses', value: '12' },
    { icon: Users, label: 'Total Students', value: '1,234' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
    { icon: DollarSign, label: 'Total Earnings', value: '$12,345' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const earningsData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: [1500, 2300, 3200, 2800, 3800, 4200, 4800, 5100, 5600, 6200, 6800, 7500],
        borderColor: '#9f7aea', // Purple color
        backgroundColor: 'rgba(159, 122, 234, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const studentsData = {
    labels: months,
    datasets: [
      {
        label: 'New Students',
        data: [0, 65, 85, 95, 0, 150, 170, 190, 0, 250, 280, 320],
        borderColor: '#38b2ac', // Teal color
        backgroundColor: 'rgba(56, 178, 172, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const courseDistributionData = {
    labels: ['Programming', 'Design', 'Business', 'Marketing', 'Music'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#9f7aea', // Purple
          '#38b2ac', // Teal
          '#4c51bf', // Indigo
          '#667eea', // Blue
          '#76e4f7', // Cyan
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0', // Light text for dark theme
        },
      },
      tooltip: {
        backgroundColor: '#1a202c',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#4a5568',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a0aec0', // Text color
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0aec0', // Text color
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e2e8f0', // Light text for dark theme
        },
      },
      tooltip: {
        backgroundColor: '#1a202c',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#4a5568',
        borderWidth: 1,
      },
    },
  };

  const handleFetchStateData = async () => {
    try {
      const response = await backendRequest('GET', '/teacher/stats');
      console.log("State data", response);
    } catch (error) {
      console.log("error", error);
    } finally {
      console.log("State data fetched");
    }
  };
  
  useEffect(() => {
    handleFetchStateData();
  }, []);

  return (
    <div className="space-y-6 relative bg-gray-900 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <stat.icon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Monthly Earnings</h3>
          <div className="h-64">
            <Line data={earningsData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">New Students</h3>
          <div className="h-64">
            <Line data={studentsData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Course Distribution</h3>
          <div className="h-64">
            <Pie data={courseDistributionData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New enrollment in "React Masterclass"', time: '2 hours ago' },
              { action: 'Course completion: "Python Basics"', time: '4 hours ago' },
              { action: 'New review on "Web Development"', time: '6 hours ago' },
              { action: 'Course published: "UI/UX Design"', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200">
                <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;