import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, ShoppingCart, MessageSquare } from 'lucide-react';
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

interface RatingDistribution {
  "5": number;
  "4": number;
  "3": number;
  "2": number;
  "1": number;
}

interface Review {
  id: string;
  user: {
    name: string;
    profilePicture: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface RatingData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CourseData {
  title: string;
  description: string;
  videoUrl: string | null;
  duration: string;
  students: string;
  rating: any;
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
  const [activeTab, setActiveTab] = useState<'curriculum' | 'reviews'>('curriculum');
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setError(null);
        
        if (!courseId) {
          throw new Error('Course ID is missing');
        }

        const response = await backendRequest("GET",`/student/course-detail/${courseId}`);
        
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
          rating: data.rating || { averageRating: 0, totalReviews: 0 },
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
        
        // Fetch rating data and initial reviews
        fetchRatingData();
        fetchReviews(1);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId]);

  // Fetch rating data
  const fetchRatingData = async () => {
    if (!courseId) return;
    
    try {
      const response = await backendRequest("GET", `/review/review-rating/${courseId}`);
      
      if (response.success && response.data) {
        setRatingData(response.data);
      }
    } catch (err) {
      console.error('Error fetching rating data:', err);
    }
  };

  // Fetch reviews with pagination
  const fetchReviews = async (page: number) => {
    if (!courseId) return;
    
    setReviewsLoading(true);
    try {
      const response = await backendRequest("GET", `/review/${courseId}?page=${page}&limit=10`);
      
      if (response.success) {
        setReviews(response.data);
        setReviewsPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= reviewsPagination.pages) {
      fetchReviews(newPage);
    }
  };

  const handleLectureClick = (lecture: Lecture) => {
    if (!lecture.isLocked) {
      setCurrentVideo(lecture.videoUrl);
      setCurrentLectureId(lecture.id);
    }
  };

  // Function to calculate rating bar percentage
  const getRatingPercentage = (rating: string, distribution: RatingDistribution) => {
    const totalReviews = ratingData.totalReviews || 0;
    if (totalReviews === 0) return 0;
    return (distribution[rating as keyof RatingDistribution] / totalReviews) * 100;
  };

  // Format date for reviews
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
                <span>{ratingData.averageRating || 0}</span>
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

            {/* Content Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-3 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'curriculum'
                    ? 'border-custom_primary text-custom_primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Course Content
                </div>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-custom_primary text-custom_primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Reviews ({ratingData.totalReviews || 0})
                </div>
              </button>
            </div>

            {/* Course Content Tab */}
            {activeTab === 'curriculum' && (
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
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Reviews</h2>
                
                {/* Rating Summary */}
                <div className="p-6 bg-gray-50 rounded-lg mb-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Average Rating */}
                    <div className="text-center md:w-1/4">
                      <div className="text-5xl font-bold text-custom_primary mb-2">
                        {ratingData.averageRating.toFixed(1) || '0.0'}
                      </div>
                      <div className="flex justify-center mb-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(ratingData.averageRating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ratingData.totalReviews || 0} {ratingData.totalReviews === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                    
                    {/* Rating Distribution */}
                    <div className="flex-grow w-full md:w-3/4">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center mb-2">
                          <div className="flex items-center w-20">
                            <span className="text-sm font-medium text-gray-700 mr-2">{rating}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          </div>
                          <div className="flex-grow h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-custom_primary rounded-full"
                              style={{ width: `${getRatingPercentage(rating.toString(), ratingData.ratingDistribution)}%` }}
                            ></div>
                          </div>
                          <div className="ml-4 w-16 text-sm text-gray-500">
                            {ratingData.ratingDistribution[rating.toString() as keyof RatingDistribution] || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-custom_primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-8">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start">
                          <img 
                         src="https://res.cloudinary.com/saadnaeem/image/upload/v1743880130/profile-icon-design-free-vector_luwo6w.jpg"

                            alt={review.user.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{review.user.name}</h3>
                              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                            </div>
                            <div className="flex mt-1 mb-3">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination */}
                    {reviewsPagination.pages > 1 && (
                      <div className="flex justify-center pt-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageChange(reviewsPagination.page - 1)}
                            disabled={reviewsPagination.page === 1}
                            className={`px-3 py-1 rounded ${
                              reviewsPagination.page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Previous
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: reviewsPagination.pages }, (_, i) => i + 1)
                            .filter(page => 
                              page === 1 || 
                              page === reviewsPagination.pages || 
                              Math.abs(page - reviewsPagination.page) <= 1
                            )
                            .reduce((acc: (number | string)[], page, i, filtered) => {
                              if (i > 0 && filtered[i - 1] !== page - 1) {
                                acc.push('...');
                              }
                              acc.push(page);
                              return acc;
                            }, [])
                            .map((page, idx) => 
                              page === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-3 py-1">...</span>
                              ) : (
                                <button
                                  key={`page-${page}`}
                                  onClick={() => handlePageChange(page as number)}
                                  className={`px-3 py-1 rounded ${
                                    page === reviewsPagination.page
                                      ? 'bg-custom_primary text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            )}
                          
                          <button
                            onClick={() => handlePageChange(reviewsPagination.page + 1)}
                            disabled={reviewsPagination.page === reviewsPagination.pages}
                            className={`px-3 py-1 rounded ${
                              reviewsPagination.page === reviewsPagination.pages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-1">No Reviews Yet</h3>
                    <p className="text-gray-500">Be the first to review this course!</p>
                  </div>
                )}
              </div>
            )}

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