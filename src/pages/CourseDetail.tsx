import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, ShoppingCart } from 'lucide-react';

function App() {
  const [currentVideo, setCurrentVideo] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [currentLectureId, setCurrentLectureId] = useState(1);

  const courseData = {
    title: "Advanced Web Development Masterclass",
    description: "Master modern web development with this comprehensive course. Learn the latest technologies, best practices, and industry standards to build professional web applications. You'll start with the fundamentals and progress to advanced concepts, building real-world projects along the way. By the end of this course, you'll have the skills needed to create sophisticated web applications and be ready for a career in web development.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "12 hours",
    students: "15,432",
    rating: "4.8",
    lectures: "35",
    progress: "28.5%",
    curriculum: [
      {
        id: 1,
        title: "Welcome to the Course",
        duration: "15:30",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 2,
        title: "Setting Up Your Development Environment",
        duration: "20:45",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 3,
        title: "Web Development Fundamentals",
        duration: "25:15",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 4,
        title: "HTML5 Essential Training",
        duration: "30:00",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 5,
        title: "CSS3 Basics",
        duration: "28:20",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 6,
        title: "Responsive Design Principles",
        duration: "35:10",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 7,
        title: "JavaScript Fundamentals",
        duration: "45:00",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 8,
        title: "DOM Manipulation",
        duration: "32:15",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 9,
        title: "Event Handling",
        duration: "28:45",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 10,
        title: "AJAX and Fetch API",
        duration: "40:30",
        isLocked: false,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
      },
      {
        id: 11,
        title: "Advanced JavaScript Concepts",
        duration: "55:00",
        isLocked: true,
        videoUrl: null,
        thumbnail: null
      },
      {
        id: 35,
        title: "Final Project and Deployment",
        duration: "60:00",
        isLocked: true,
        videoUrl: null,
        thumbnail: null
      }
    ],
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "Senior Web Developer & Tech Lead",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      bio: "With over 15 years of industry experience, Dr. Sarah Johnson has led development teams at major tech companies and has helped thousands of students master web development. She holds a Ph.D. in Computer Science and is passionate about making complex technical concepts accessible to everyone.",
      stats: {
        students: "50,000+",
        courses: "12",
        rating: "4.9"
      }
    },
    recommendedCourses: [
      {
        id: 1,
        title: "React Performance Optimization",
        instructor: "Michael Chen",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: "4.7",
        students: "8,245"
      },
      {
        id: 2,
        title: "Full-Stack Development with Node.js",
        instructor: "Emma Wilson",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: "4.9",
        students: "12,331"
      },
      {
        id: 3,
        title: "UI/UX Design Principles",
        instructor: "Alex Thompson",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: "4.6",
        students: "9,876"
      }
    ]
  };

  const handleLectureClick = (lecture) => {
    if (!lecture.isLocked) {
      setCurrentVideo(lecture.videoUrl);
      setCurrentLectureId(lecture.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-custom_primary to-custom_primary_hover text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1" />
              <span>{courseData.rating}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-1" />
              <span>{courseData.students} students</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-1" />
              <span>{courseData.lectures} lectures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden shadow-lg mb-8">
              <ReactPlayer
                url={currentVideo}
                width="100%"
                height="500px"
                controls
              />
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {courseData.description}
              </p>
            </div>

            {/* Instructor Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Meet Your Instructor</h2>
                  <h3 className="text-xl font-semibold mb-1">{courseData.instructor.name}</h3>
                  <p className="text-gray-600">{courseData.instructor.title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.students}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.courses}</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {courseData.instructor.bio}
              </p>
            </div>

            {/* Mobile Curriculum */}
            <div className="lg:hidden bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold mb-2">Course Curriculum</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-custom_primary h-2 rounded-full" style={{ width: courseData.progress }}></div>
                  </div>
                  <span className="ml-4">{courseData.progress} complete</span>
                </div>
              </div>
              <div className="divide-y">
                {courseData.curriculum.map((lecture) => (
                  <div
                    key={lecture.id}
                    onClick={() => handleLectureClick(lecture)}
                    className={`p-4 flex items-center justify-between ${
                      !lecture.isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {lecture.thumbnail ? (
                        <img src={lecture.thumbnail} alt="" className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          {lecture.videoUrl ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : currentLectureId === lecture.id ? (
                            <Play className="w-4 h-4 text-custom_primary" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-gray-600" />
                          )}
                          <span className={lecture.isLocked ? 'text-gray-400' : 'text-gray-900'}>
                            {lecture.title}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{lecture.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-4">
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">${1000}</span>
                <span className="text-xl text-gray-500 line-through ml-2">${1500}</span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">
                  {25}% off
                </span>
              </div>
              <button
                className="w-full bg-custom_primary text-white py-4 px-6 rounded-lg font-semibold text-lg mb-4 hover:bg-custom_primary_hover transition-colors flex items-center justify-center gap-2"
                onClick={() => alert('Purchase functionality would go here')}
              >
                <ShoppingCart className="w-5 h-5" />
                Purchase Course
              </button>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
            {/* Desktop Curriculum */}
            <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold mb-2">Course Curriculum</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-custom_primary h-2 rounded-full" style={{ width: courseData.progress }}></div>
                  </div>
                  <span className="ml-4">{courseData.progress} complete</span>
                </div>
              </div>
              <div className="divide-y max-h-[calc(100vh-8rem)] overflow-y-auto">
                {courseData.curriculum.map((lecture) => (
                  <div
                    key={lecture.id}
                    onClick={() => handleLectureClick(lecture)}
                    className={`p-4 flex items-center justify-between ${
                      !lecture.isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {lecture.thumbnail ? (
                        <img src={lecture.thumbnail} alt="" className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          {lecture.isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : currentLectureId === lecture.id ? (
                            <Play className="w-4 h-4 text-custom_primary" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-gray-600" />
                          )}
                          <span className={lecture.isLocked ? 'text-gray-400' : 'text-gray-900'}>
                            {lecture.title}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{lecture.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseData.recommendedCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-1" />
                      <span>{course.students}</span>
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
}

export default App;


// import React, { useState } from 'react';
// import ReactPlayer from 'react-player';
// import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, ShoppingCart } from 'lucide-react';

// function App() {
//   const [currentVideo, setCurrentVideo] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
//   const [currentLectureId, setCurrentLectureId] = useState(1);

//   const courseData = {
//     title: "Advanced Web Development Masterclass",
//     description: "Master modern web development with this comprehensive course. Learn the latest technologies, best practices, and industry standards to build professional web applications. You'll start with the fundamentals and progress to advanced concepts, building real-world projects along the way. By the end of this course, you'll have the skills needed to create sophisticated web applications and be ready for a career in web development.",
//     videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     duration: "12 hours",
//     students: "15,432",
//     rating: "4.8",
//     lectures: "35",
//     progress: "28.5%",
//     price: {
//       original: 199.99,
//       current: 89.99,
//       discount: 55
//     },
//     curriculum: [
//       {
//         id: 1,
//         title: "Welcome to the Course",
//         duration: "15:30",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 2,
//         title: "Setting Up Your Development Environment",
//         duration: "20:45",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 3,
//         title: "Web Development Fundamentals",
//         duration: "25:15",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 4,
//         title: "HTML5 Essential Training",
//         duration: "30:00",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 5,
//         title: "CSS3 Basics",
//         duration: "28:20",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 6,
//         title: "Responsive Design Principles",
//         duration: "35:10",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 7,
//         title: "JavaScript Fundamentals",
//         duration: "45:00",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 8,
//         title: "DOM Manipulation",
//         duration: "32:15",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 9,
//         title: "Event Handling",
//         duration: "28:45",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 10,
//         title: "AJAX and Fetch API",
//         duration: "40:30",
//         isLocked: false,
//         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
//       },
//       {
//         id: 11,
//         title: "Advanced JavaScript Concepts",
//         duration: "55:00",
//         isLocked: true,
//         videoUrl: null,
//         thumbnail: null
//       },
//       {
//         id: 35,
//         title: "Final Project and Deployment",
//         duration: "60:00",
//         isLocked: true,
//         videoUrl: null,
//         thumbnail: null
//       }
//     ],
//     instructor: {
//       name: "Dr. Sarah Johnson",
//       title: "Senior Web Developer & Tech Lead",
//       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
//       bio: "With over 15 years of industry experience, Dr. Sarah Johnson has led development teams at major tech companies and has helped thousands of students master web development. She holds a Ph.D. in Computer Science and is passionate about making complex technical concepts accessible to everyone.",
//       stats: {
//         students: "50,000+",
//         courses: "12",
//         rating: "4.9"
//       }
//     },
//     recommendedCourses: [
//       {
//         id: 1,
//         title: "React Performance Optimization",
//         instructor: "Michael Chen",
//         image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//         rating: "4.7",
//         students: "8,245"
//       },
//       {
//         id: 2,
//         title: "Full-Stack Development with Node.js",
//         instructor: "Emma Wilson",
//         image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//         rating: "4.9",
//         students: "12,331"
//       },
//       {
//         id: 3,
//         title: "UI/UX Design Principles",
//         instructor: "Alex Thompson",
//         image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//         rating: "4.6",
//         students: "9,876"
//       }
//     ]
//   };

//   const handleLectureClick = (lecture) => {
//     if (!lecture.isLocked) {
//       setCurrentVideo(lecture.videoUrl);
//       setCurrentLectureId(lecture.id);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-custom_primary to-blue-800 text-white py-12">
//         <div className="container mx-auto px-4 lg:px-8">
//           <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
//           <div className="flex flex-wrap items-center gap-6 text-sm">
//             <div className="flex items-center">
//               <Star className="w-5 h-5 mr-1" />
//               <span>{courseData.rating}</span>
//             </div>
//             <div className="flex items-center">
//               <Users className="w-5 h-5 mr-1" />
//               <span>{courseData.students} students</span>
//             </div>
//             <div className="flex items-center">
//               <Clock className="w-5 h-5 mr-1" />
//               <span>{courseData.duration}</span>
//             </div>
//             <div className="flex items-center">
//               <BookOpen className="w-5 h-5 mr-1" />
//               <span>{courseData.lectures} lectures</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content Column */}
//           <div className="lg:col-span-2">
//             {/* Video Player */}
//             <div className="rounded-lg overflow-hidden shadow-lg mb-8">
//               <ReactPlayer
//                 url={currentVideo}
//                 width="100%"
//                 height="500px"
//                 controls
//               />
//             </div>

//             {/* Course Description */}
//             <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
//               <h2 className="text-2xl font-bold mb-4">About This Course</h2>
//               <p className="text-gray-700 leading-relaxed mb-6">
//                 {courseData.description}
//               </p>
//             </div>

//             {/* Instructor Section */}
//             <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
//               <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
//                 <img
//                   src={courseData.instructor.avatar}
//                   alt={courseData.instructor.name}
//                   className="w-24 h-24 rounded-full object-cover"
//                 />
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">Meet Your Instructor</h2>
//                   <h3 className="text-xl font-semibold mb-1">{courseData.instructor.name}</h3>
//                   <p className="text-gray-600">{courseData.instructor.title}</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.students}</div>
//                   <div className="text-sm text-gray-600">Students</div>
//                 </div>
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.courses}</div>
//                   <div className="text-sm text-gray-600">Courses</div>
//                 </div>
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <div className="text-2xl font-bold text-custom_primary">{courseData.instructor.stats.rating}</div>
//                   <div className="text-sm text-gray-600">Rating</div>
//                 </div>
//               </div>

//               <p className="text-gray-700 leading-relaxed">
//                 {courseData.instructor.bio}
//               </p>
//             </div>

//             {/* Mobile Curriculum */}
//             <div className="lg:hidden bg-white rounded-lg shadow-lg overflow-hidden mb-8">
//               <div className="p-6 border-b">
//                 <h3 className="text-xl font-bold mb-2">Course Curriculum</h3>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div className="bg-custom_primary h-2 rounded-full" style={{ width: courseData.progress }}></div>
//                   </div>
//                   <span className="ml-4">{courseData.progress} complete</span>
//                 </div>
//               </div>
//               <div className="divide-y">
//                 {courseData.curriculum.map((lecture) => (
//                   <div
//                     key={lecture.id}
//                     onClick={() => handleLectureClick(lecture)}
//                     className={`p-4 flex items-center justify-between ${
//                       !lecture.isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-4">
//                       {lecture.thumbnail ? (
//                         <img src={lecture.thumbnail} alt="" className="w-16 h-12 object-cover rounded" />
//                       ) : (
//                         <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
//                           <Video className="w-6 h-6 text-gray-400" />
//                         </div>
//                       )}
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           {lecture.isLocked ? (
//                             <Lock className="w-4 h-4 text-gray-400" />
//                           ) : currentLectureId === lecture.id ? (
//                             <Play className="w-4 h-4 text-custom_primary" />
//                           ) : (
//                             <PlayCircle className="w-4 h-4 text-gray-600" />
//                           )}
//                           <span className={lecture.isLocked ? 'text-gray-400' : 'text-gray-900'}>
//                             {lecture.title}
//                           </span>
//                         </div>
//                         <span className="text-sm text-gray-500">{lecture.duration}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             {/* Purchase Card */}
//             <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-4">
//               <div className="flex items-baseline mb-4">
//                 <span className="text-3xl font-bold text-gray-900">${courseData.price.current}</span>
//                 <span className="text-xl text-gray-500 line-through ml-2">${courseData.price.original}</span>
//                 <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">
//                   {courseData.price.discount}% off
//                 </span>
//               </div>
//               <button
//                 className="w-full bg-custom_primary text-white py-4 px-6 rounded-lg font-semibold text-lg mb-4 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                 onClick={() => alert('Purchase functionality would go here')}
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 Purchase Course
//               </button>
//               <div className="space-y-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   <span>Full lifetime access</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   <span>Access on mobile and desktop</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   <span>Certificate of completion</span>
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Curriculum */}
//             <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden sticky top-[calc(4rem+24rem)]">
//               <div className="p-6 border-b">
//                 <h3 className="text-xl font-bold mb-2">Course Curriculum</h3>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div className="bg-custom_primary h-2 rounded-full" style={{ width: courseData.progress }}></div>
//                   </div>
//                   <span className="ml-4">{courseData.progress} complete</span>
//                 </div>
//               </div>
//               <div className="divide-y max-h-[calc(100vh-8rem)] overflow-y-auto">
//                 {courseData.curriculum.map((lecture) => (
//                   <div
//                     key={lecture.id}
//                     onClick={() => handleLectureClick(lecture)}
//                     className={`p-4 flex items-center justify-between ${
//                       !lecture.isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-4">
//                       {lecture.thumbnail ? (
//                         <img src={lecture.thumbnail} alt="" className="w-16 h-12 object-cover rounded" />
//                       ) : (
//                         <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
//                           <Video className="w-6 h-6 text-gray-400" />
//                         </div>
//                       )}
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           {lecture.isLocked ? (
//                             <Lock className="w-4 h-4 text-gray-400" />
//                           ) : currentLectureId === lecture.id ? (
//                             <Play className="w-4 h-4 text-custom_primary" />
//                           ) : (
//                             <PlayCircle className="w-4 h-4 text-gray-600" />
//                           )}
//                           <span className={lecture.isLocked ? 'text-gray-400' : 'text-gray-900'}>
//                             {lecture.title}
//                           </span>
//                         </div>
//                         <span className="text-sm text-gray-500">{lecture.duration}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recommended Courses */}
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold mb-8">Recommended Courses</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {courseData.recommendedCourses.map((course) => (
//               <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
//                 <img
//                   src={course.image}
//                   alt={course.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold mb-2">{course.title}</h3>
//                   <p className="text-gray-600 mb-4">{course.instructor}</p>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Star className="w-5 h-5 text-yellow-400 mr-1" />
//                       <span>{course.rating}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Users className="w-5 h-5 mr-1" />
//                       <span>{course.students}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;