import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, ShoppingCart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { backendRequest } from '@/Helper/backendRequest';

interface Lecture {
  title: string;
  id: string;
  duration: string;
  isLocked: boolean;
  thumbnail: string | null;
  videoUrl: string | null;
}

interface Instructor {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  stats: {
    students: string;
    courses: string;
    rating: string;
  };
}

interface CourseData {
  title: string;
  description: string;
  videoUrl: string | null;
  duration: string;
  students: string;
  rating: string;
  lectures: string;
  progress: string;
  thumbnail: string;
  curriculum: Lecture[];
  instructor: Instructor;
  price: {
    original: number;
    current: number;
    discount: number;
  };
}

function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!courseId) {
          throw new Error('Course ID is missing');
        }

        const response = await backendRequest("GET", `/student/course-detail/${courseId}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch course details');
        }

        const data = response.data;
        
        // Process and validate data
        const processedData: CourseData = {
          title: data.title || 'Untitled Course',
          description: data.description || 'No description available',
          videoUrl: data.videoUrl || null,
          duration: data.duration || '0 hours',
          students: data.students || '0',
          rating: data.rating || '0.0',
          lectures: data.lectures || '0',
          progress: data.progress || '0%',
          thumbnail: data.thumbnail || 'https://via.placeholder.com/800x450',
          curriculum: data.curriculum?.map((lecture: any) => ({
            id: lecture.id || '',
            title: lecture.title || 'Untitled Lecture',
            duration: lecture.duration || '00:00',
            isLocked: lecture.isLocked || false,
            videoUrl: lecture.isLocked ? null : lecture.videoUrl || null,
            thumbnail: lecture.thumbnail || 'https://via.placeholder.com/300x200'
          })) || [],
          instructor: {
            name: data.instructor?.name || 'Unknown Instructor',
            title: data.instructor?.title || 'Instructor',
            avatar: data.instructor?.avatar || 'https://via.placeholder.com/150',
            bio: data.instructor?.bio || `About ${data.instructor?.name || 'the instructor'}`,
            stats: {
              students: data.instructor?.stats?.students || '0',
              courses: data.instructor?.stats?.courses || '0',
              rating: data.instructor?.stats?.rating || '0.0'
            }
          },
          price: {
            original: data.price?.original || 0,
            current: data.price?.current || 0,
            discount: data.price?.discount || 0
          }
        };

        const demoVideoUrl = processedData.curriculum.length > 0 && !processedData.curriculum[0].isLocked 
          ? processedData.curriculum[0].videoUrl 
          : processedData.videoUrl;

        setCourseData(processedData);
        setCurrentVideo(demoVideoUrl);
        setCurrentLectureId(processedData.curriculum[0]?.id || null);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleLectureClick = (lecture: Lecture) => {
    if (!lecture.isLocked) {
      setCurrentVideo(lecture.videoUrl);
      setCurrentLectureId(lecture.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom_primary mx-auto"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Course</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-custom_primary text-white rounded hover:bg-custom_primary_hover"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The requested course could not be found.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-custom_primary text-white rounded hover:bg-custom_primary_hover"
          >
            Browse Available Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-custom_primary to-custom_primary_hover py-12 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{courseData.title}</h1>
              <p className="text-sm opacity-90 max-w-3xl">{courseData.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 mr-1" />
                <span>{courseData.rating}</span>
              </div>
              <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                <Users className="w-4 h-4 mr-1" />
                <span>{courseData.students} students</span>
              </div>
              <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span>{courseData.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-black aspect-video">
              {currentVideo ? (
                <ReactPlayer
                  url={currentVideo}
                  width="100%"
                  height="100%"
                  controls
                  style={{ aspectRatio: '16/9' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center p-6">
                    <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">No Video Available</h3>
                    <p className="text-gray-400">This course doesn't have any video content yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-4">
                {courseData.curriculum.length > 0 ? (
                  courseData.curriculum.map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => handleLectureClick(lecture)}
                      className={`p-4 rounded-lg border transition-all ${
                        !lecture.isLocked
                          ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-300'
                          : 'cursor-not-allowed bg-gray-50'
                      } ${
                        currentLectureId === lecture.id
                          ? 'border-custom_primary bg-custom_primary/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {lecture.thumbnail ? (
                            <img
                              src={lecture.thumbnail}
                              alt=""
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Video className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium ${
                                lecture.isLocked ? 'text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {lecture.title}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {lecture.duration}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            {lecture.isLocked ? (
                              <>
                                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">Locked</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 text-custom_primary mr-2" />
                                <span className="text-sm text-gray-500">Available</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">
                      No curriculum available yet
                    </h3>
                  </div>

                )}
            </div>
            </div>
            {/* Instructor Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Instructor</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {courseData.instructor.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{courseData.instructor.title}</p>
                  <p className="text-gray-700 mb-6">{courseData.instructor.bio}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-custom_primary">
                        {courseData.instructor.stats.students}
                      </div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-custom_primary">
                        {courseData.instructor.stats.courses}
                      </div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-custom_primary">
                        {courseData.instructor.stats.rating}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${courseData.price.original.toFixed(2)}
                </span>
              
              
              </div>
              <button
                className="w-full bg-custom_primary hover:bg-custom_primary_hover text-white py-3 px-6 rounded-lg font-semibold text-lg mb-4 transition-colors flex items-center justify-center gap-2"
                onClick={() => alert('Purchase functionality would go here')}
              >
                <ShoppingCart className="w-5 h-5" />
                Purchase Course
              </button>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Access on mobile and desktop</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Certificate of completion</span>
                </div>
              </div>
            </div>

   
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;