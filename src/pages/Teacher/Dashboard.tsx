// import React, { useEffect } from 'react';
// import { Users, BookOpen, Star, DollarSign } from 'lucide-react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import { Line, Pie } from 'react-chartjs-2';
// import { backendRequest } from '@/Helper/backendRequest';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const Dashboard: React.FC = () => {
//   const stats = [
//     { icon: BookOpen, label: 'Total Courses', value: '12' },
//     { icon: Users, label: 'Total Students', value: '1,234' },
//     { icon: Star, label: 'Average Rating', value: '4.8' },
//     { icon: DollarSign, label: 'Total Earnings', value: '$12,345' },
//   ];

//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
//   const earningsData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Monthly Earnings ($)',
//         data: [1500, 2300, 3200, 2800, 3800, 4200, 4800, 5100, 5600, 6200, 6800, 7500],
//         borderColor: '#9f7aea', // Purple color
//         backgroundColor: 'rgba(159, 122, 234, 0.2)',
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const studentsData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'New Students',
//         data: [0, 65, 85, 95, 0, 150, 170, 190, 0, 250, 280, 320],
//         borderColor: '#38b2ac', // Teal color
//         backgroundColor: 'rgba(56, 178, 172, 0.2)',
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const courseDistributionData = {
//     labels: ['Programming', 'Design', 'Business', 'Marketing', 'Music'],
//     datasets: [
//       {
//         data: [35, 25, 20, 15, 5],
//         backgroundColor: [
//           '#9f7aea', // Purple
//           '#38b2ac', // Teal
//           '#4c51bf', // Indigo
//           '#667eea', // Blue
//           '#76e4f7', // Cyan
//         ],
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//         labels: {
//           color: '#e2e8f0', // Light text for dark theme
//         },
//       },
//       tooltip: {
//         backgroundColor: '#1a202c',
//         titleColor: '#e2e8f0',
//         bodyColor: '#e2e8f0',
//         borderColor: '#4a5568',
//         borderWidth: 1,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//         },
//         ticks: {
//           color: '#a0aec0', // Text color
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#a0aec0', // Text color
//         }
//       },
//     },
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'right' as const,
//         labels: {
//           color: '#e2e8f0', // Light text for dark theme
//         },
//       },
//       tooltip: {
//         backgroundColor: '#1a202c',
//         titleColor: '#e2e8f0',
//         bodyColor: '#e2e8f0',
//         borderColor: '#4a5568',
//         borderWidth: 1,
//       },
//     },
//   };

//   const handleFetchStateData = async () => {
//     try {
//       const response = await backendRequest('GET', '/teacher/stats');
//       console.log("State data", response);
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       console.log("State data fetched");
//     }
//   };
  
//   useEffect(() => {
//     handleFetchStateData();
//   }, []);

//   return (
//     <div className="space-y-6 relative bg-gray-900 p-6 rounded-lg">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
//             <div className="flex items-center gap-4">
//               <div className="bg-purple-900/30 p-4 rounded-lg">
//                 <stat.icon className="h-6 w-6 text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400">{stat.label}</p>
//                 <p className="text-2xl font-bold text-white">{stat.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold mb-4 text-white">Monthly Earnings</h3>
//           <div className="h-64">
//             <Line data={earningsData} options={chartOptions} />
//           </div>
//         </div>

//         <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold mb-4 text-white">New Students</h3>
//           <div className="h-64">
//             <Line data={studentsData} options={chartOptions} />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold mb-4 text-white">Course Distribution</h3>
//           <div className="h-64">
//             <Pie data={courseDistributionData} options={pieOptions} />
//           </div>
//         </div>

//         <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
//           <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
//           <div className="space-y-4">
//             {[
//               { action: 'New enrollment in "React Masterclass"', time: '2 hours ago' },
//               { action: 'Course completion: "Python Basics"', time: '4 hours ago' },
//               { action: 'New review on "Web Development"', time: '6 hours ago' },
//               { action: 'Course published: "UI/UX Design"', time: '1 day ago' },
//             ].map((activity, index) => (
//               <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200">
//                 <p className="text-sm font-medium text-gray-200">{activity.action}</p>
//                 <span className="text-xs text-gray-400">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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

interface StatsData {
  courseCount: number;
  totalStudentEnrolled: number;
  totalEarning: number;
  averageRating: string;
  categoryDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  courses: Array<{
    _id: string;
    title: string;
    studentsEnrolled: Array<{
      _id: string;
      student: {
        _id: string;
        name: string;
        email: string;
      } | null;
      amountPaid: number;
      entrolledAt: string;
      progress: {
        completedVideos: number;
        totalVideos: number;
      };
    }>;
  }>;
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process enrollment data for charts
  const processEnrollmentData = () => {
    if (!statsData) return { monthlyEarnings: [], monthlyStudents: [] };

    // Group by month
    const monthlyData: Record<string, { earnings: number; students: number }> = {};

    statsData.courses.forEach(course => {
      course.studentsEnrolled.forEach(student => {
        const date = new Date(student.entrolledAt);
        const month = format(date, 'MMM'); // e.g. "Apr"
        
        if (!monthlyData[month]) {
          monthlyData[month] = { earnings: 0, students: 0 };
        }
        
        monthlyData[month].earnings += student.amountPaid;
        monthlyData[month].students += 1;
      });
    });

    // Fill all months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyEarnings = months.map(month => monthlyData[month]?.earnings || 0);
    const monthlyStudents = months.map(month => monthlyData[month]?.students || 0);

    return { monthlyEarnings, monthlyStudents };
  };

  const { monthlyEarnings, monthlyStudents } = processEnrollmentData();

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Total Courses', 
      value: statsData?.courseCount || 0,
      loading
    },
    { 
      icon: Users, 
      label: 'Total Students', 
      value: statsData?.totalStudentEnrolled || 0,
      loading
    },
    { 
      icon: Star, 
      label: 'Average Rating', 
      value: statsData?.averageRating || '0',
      loading
    },
    { 
      icon: DollarSign, 
      label: 'Total Earnings', 
      value: `$${statsData?.totalEarning?.toLocaleString() || 0}`,
      loading
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const earningsData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: monthlyEarnings,
        borderColor: '#9f7aea',
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
        data: monthlyStudents,
        borderColor: '#38b2ac',
        backgroundColor: 'rgba(56, 178, 172, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const courseDistributionData = {
    labels: statsData?.categoryDistribution.map(c => c.name) || [],
    datasets: [
      {
        data: statsData?.categoryDistribution.map(c => c.percentage) || [],
        backgroundColor: [
          '#9f7aea',
          '#38b2ac',
          '#4c51bf',
          '#667eea',
          '#76e4f7',
          '#f687b3',
          '#f6ad55',
          '#68d391',
          '#4fd1c5',
          '#d6bcfa'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Inter, sans-serif',
          }
        },
      },
      tooltip: {
        backgroundColor: '#1a202c',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#4a5568',
        borderWidth: 1,
        titleFont: {
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a0aec0',
          font: {
            family: 'Inter, sans-serif',
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0aec0',
          font: {
            family: 'Inter, sans-serif',
          }
        }
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad' as const,
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Inter, sans-serif',
          },
          padding: 20,
          boxWidth: 16,
          usePointStyle: true,
        },
      },
    },
  };

  const handleFetchStateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendRequest('GET', '/teacher/stats');
      if (response.success) {
        setStatsData(response.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleFetchStateData();
  }, []);

  // Get recent enrollments for activity feed
  const recentActivities = statsData?.courses
    ?.flatMap(course => 
      course.studentsEnrolled.map(student => ({
        action: `New enrollment in "${course.title}"`,
        studentName: student.student?.name || 'Anonymous',
        time: format(new Date(student.entrolledAt), 'MMM d, yyyy - h:mm a'),
        amount: student.amountPaid,
        progress: `${student.progress.completedVideos}/${student.progress.totalVideos} videos completed`,
      })))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 4) || [];

  return (
    <div className="space-y-6 relative bg-gray-900 p-6 rounded-lg">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={handleFetchStateData}
            className="text-red-300 hover:text-white px-3 py-1 rounded border border-red-700 hover:bg-red-800/50 transition"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <stat.icon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-400 truncate">{stat.label}</p>
                {stat.loading ? (
                  <Skeleton className="h-8 w-20 mt-1 bg-gray-700" />
                ) : (
                  <p className="text-2xl font-bold text-white truncate">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Earnings</h3>
            {loading && <Skeleton className="h-4 w-20 bg-gray-700" />}
          </div>
          <div className="h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Line data={earningsData} options={chartOptions} />
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">New Students</h3>
            {loading && <Skeleton className="h-4 w-20 bg-gray-700" />}
          </div>
          <div className="h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Line data={studentsData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Course Categories</h3>
            {loading && <Skeleton className="h-4 w-20 bg-gray-700" />}
          </div>
          <div className="h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse rounded-full h-32 w-32 bg-gray-700"></div>
              </div>
            ) : (
              <Pie data={courseDistributionData} options={pieOptions} />
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            {loading && <Skeleton className="h-4 w-20 bg-gray-700" />}
          </div>
          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                  <Skeleton className="h-4 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-3 w-1/2 bg-gray-700" />
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex flex-col p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">
                        Student: {activity.studentName} • Paid: ${activity.amount}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  {/* <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      Progress: {activity.progress}
                    </p>
                  </div> */}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;