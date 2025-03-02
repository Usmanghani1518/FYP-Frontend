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
        borderColor: '#6e11b0',
        backgroundColor: 'rgba(110, 17, 176, 0.1)',
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
        data: [0, 65, 85, 95,0, 150, 170, 190, 0, 250, 280, 320],
        borderColor: '#4d179a',
        backgroundColor: 'rgba(77, 23, 154, 0.1)',
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
          'rgba(110, 17, 176, 0.8)',
          'rgba(77, 23, 154, 0.8)',
          'rgba(130, 50, 196, 0.8)',
          'rgba(150, 80, 216, 0.8)',
          'rgba(170, 110, 236, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const hanldeFetchStateData = async ()=>{

 try {
     const responsne = await backendRequest('GET', '/teacher/stats');
    console.log("State data",responsne);
 } catch (error) {
  console.log("error",error);
 }
 finally{
  console.log("State data fetched");
 }

  }
  
  useEffect(() => {
    hanldeFetchStateData();
  }, []);



  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-custom_primary/10 p-4 rounded-lg">
                <stat.icon className="h-6 w-6 text-custom_primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
          <div className="h-64">
            <Line data={earningsData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">New Students</h3>
          <div className="h-64">
            <Line data={studentsData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Course Distribution</h3>
          <div className="h-64">
            <Pie data={courseDistributionData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New enrollment in "React Masterclass"', time: '2 hours ago' },
              { action: 'Course completion: "Python Basics"', time: '4 hours ago' },
              { action: 'New review on "Web Development"', time: '6 hours ago' },
              { action: 'Course published: "UI/UX Design"', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;