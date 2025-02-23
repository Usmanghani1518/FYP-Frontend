import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  // TrendingUp,
  Star,
  // Clock,
  // Award
} from 'lucide-react';
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

const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Total Students', value: '5,234', trend: '+12%' },
    { icon: GraduationCap, label: 'Total Teachers', value: '142', trend: '+5%' },
    { icon: BookOpen, label: 'Total Courses', value: '328', trend: '+8%' },
    { icon: DollarSign, label: 'Total Revenue', value: '$142,345', trend: '+15%' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: 'Platform Revenue ($)',
        data: [15000, 23000, 32000, 28000, 38000, 42000, 48000, 51000, 56000, 62000, 68000, 75000],
        borderColor: '#6e11b0',
        backgroundColor: 'rgba(110, 17, 176, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: months,
    datasets: [
      {
        label: 'Students',
        data: [1200, 1500, 1800, 2100, 2500, 2800, 3200, 3600, 4100, 4500, 4900, 5234],
        borderColor: '#4d179a',
        backgroundColor: 'rgba(77, 23, 154, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Teachers',
        data: [1200, 1100, 1800, 2500, 20, 2800, 3000, 4000, 4100, 4900, 3000, 5234],
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 10, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',   /* Soft Red */
'rgba(54, 162, 235, 0.8)',   /* Soft Blue */
'rgba(255, 206, 86, 0.8)',   /* Light Yellow */
'rgba(75, 192, 192, 0.8)',   /* Mint Green */
'rgba(153, 102, 255, 0.8)',  /* Light Purple */
'rgba(255, 159, 64, 0.8)',   /* Peach Orange */

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

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-custom_primary/10 p-4 rounded-lg">
                  <stat.icon className="h-6 w-6 text-custom_primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <div className="text-green-500 text-sm font-medium">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-[300px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-[300px]">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Course Categories</h3>
          <div className="h-[300px]">
            <Pie data={categoryData} />
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {[
              { title: 'Complete Web Development Bootcamp', students: 1234, rating: 4.9, earnings: '$12,345' },
              { title: 'Advanced Machine Learning', students: 987, rating: 4.8, earnings: '$9,876' },
              { title: 'UI/UX Design Masterclass', students: 876, rating: 4.7, earnings: '$8,765' },
              { title: 'Digital Marketing Pro', students: 765, rating: 4.6, earnings: '$7,654' },
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {course.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {course.earnings}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;