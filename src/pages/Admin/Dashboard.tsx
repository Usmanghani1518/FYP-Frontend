import React, { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Star,
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

interface DashboardData {
  success: boolean;
  data: {
    teachersCount: number;
    studentsCount: number;
    totalEarnings: number;
    totalCourses : number;
    teachers: Array<User>;
    students: Array<User>;
    earning: Array<Earning>;
  };
}

interface User {
  _id: string;
  createdAt: string;
}

interface Earning {
  adminProfit: number;
  paidAt: string;
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchStatistics = async () => {
    try {
      const res = await backendRequest("GET", "/admin/stats");
      setDashboardData(res);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const stats = [
    { icon: Users, label: 'Total Students', value: dashboardData?.data.studentsCount || 'Loading...' },
    { icon: GraduationCap, label: 'Total Teachers', value: dashboardData?.data.teachersCount || 'Loading...' },
    { icon: BookOpen, label: 'Total Courses', value: `${dashboardData?.data.totalCourses}` }, // Static for now
    { icon: DollarSign, label: 'Total Revenue', value: `$${dashboardData?.data.totalEarnings}` },
  ];

  const revenueData = {
    labels: months,
    datasets: [
      {
        label: 'Platform Revenue ($)',
        data: dashboardData?.data.earning.map((earning) => earning.adminProfit) || Array(12).fill(0),
        borderColor: '#6e11b0',
        backgroundColor: 'rgba(110, 17, 176, 0.3)',
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
        data: dashboardData?.data.students.map((student, index) => index * 100) || Array(12).fill(0), // Example growth data
        borderColor: '#4d179a',
        backgroundColor: 'rgba(77, 23, 154, 0.3)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Teachers',
        data: dashboardData?.data.teachers.map((teacher, index) => index * 50) || Array(12).fill(0), // Example growth data
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.3)',
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
          '#e57373', '#64b5f6', '#fff176', '#81c784', '#ba68c8', '#ffb74d'
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
          color: '#d1d5db', // text-gray-300
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#d1d5db', // text-gray-300
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#d1d5db', // text-gray-300
        },
      },
    },
  };

  return (
    <div className="space-y-6 bg-gray-900 text-gray-300 p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-900 p-4 rounded-lg">
                  <stat.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <div className="text-green-500 text-sm font-medium">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Revenue Overview</h3>
          <div className="h-[300px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">User Growth</h3>
          <div className="h-[300px]">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Course Categories</h3>
          <div className="h-[300px]">
            <Pie data={categoryData} />
          </div>
        </div>

        <div className="col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Top Performing Courses</h3>
          <div className="space-y-4">
            {[
              { title: 'Web Development Bootcamp', students: 1234, rating: 4.9, earnings: '$12,345' },
              { title: 'Advanced Machine Learning', students: 987, rating: 4.8, earnings: '$9,876' },
              { title: 'UI/UX Design Masterclass', students: 876, rating: 4.7, earnings: '$8,765' },
              { title: 'Digital Marketing Pro', students: 765, rating: 4.6, earnings: '$7,654' },
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{course.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
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