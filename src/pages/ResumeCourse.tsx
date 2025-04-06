import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendRequest } from '@/Helper/backendRequest';
import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, Award } from 'lucide-react';
import ReactPlayer from 'react-player';

interface CourseData {
  title: string;
  description: string;
  thumbnail: string;
  rating: string;
  students: number;
  lectures: number;
  curriculum: {
    id: string;
    title: string;
    videoUrl: string;
    isLocked: boolean;
    completed: boolean;
  }[];
  resumeVideo: {
    id: string;
    title: string;
    url: string;
  } | null;
  nextVideo: {
    id: string;
    title: string;
    url: string;
  } | null;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    stats: {
      students: number;
      courses: number;
      rating: string;
    };
  };
}

function ResumeCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await backendRequest('GET', `/student/resume-course/${courseId}`);
        
        if (response.success) {
          setCourseData(response.data);
          // Set initial video to resume video or next video
          setCurrentVideo(
            response.data.resumeVideo?.url || 
            response.data.nextVideo?.url || 
            null
          );
        } else {
          setError(response.message || 'Failed to load course data');
        }
      } catch (err) {
        setError('An error occurred while fetching course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleVideoSelect = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading course...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!courseData) {
    return <div className="text-center py-8">No course data available</div>;
  }

  return (
    <div className="min-h-screen text-white bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1" />
              <span>{courseData.rating}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-1" />
              <span>{courseData.students.toLocaleString()} students</span>
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
            <div className="rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-800">
              {currentVideo ? (
                <ReactPlayer
                  url={currentVideo}
                  width="100%"
                  height="500px"
                  controls
                />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center">
                  <p>No video selected</p>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed">
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet Your Instructor</h2>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{courseData.instructor.name}</h3>
                  <p className="text-gray-600">{courseData.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Progress Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="flex items-center mb-6">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="10"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * courseData.progress.percentage) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{courseData.progress.percentage}%</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-gray-500">Videos Completed</div>
                  <div className="text-lg font-semibold">
                    {courseData.progress.completed}/{courseData.progress.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Course Curriculum</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${courseData.progress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-4">{courseData.progress.percentage}% complete</span>
                </div>
              </div>
              <div className="divide-y">
                {courseData.curriculum.length > 0 ? (
                  courseData.curriculum.map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => !lecture.isLocked && handleVideoSelect(lecture.videoUrl)}
                      className={`p-4 flex items-center justify-between ${
                        !lecture.isLocked ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            {lecture.isLocked ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : lecture.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : currentVideo === lecture.videoUrl ? (
                              <Play className="w-4 h-4 text-blue-600" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={lecture.isLocked ? 'text-gray-400' : 'text-gray-900'}>
                              {lecture.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No lectures available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeCourse;