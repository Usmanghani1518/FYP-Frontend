import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { backendRequest } from '@/Helper/backendRequest';
import { Clock, Star, Users, PlayCircle, BookOpen, Lock, Play, CheckCircle, Video, Edit, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactPlayer from 'react-player';
import { notifyResponse } from '@/Helper/notify';
import { DiscussionBoard } from '@/pages/Discussion'; 
import { motion, AnimatePresence } from 'framer-motion';
import QuizPage from './QuizPage';

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

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  isEdited: boolean;
}

interface RatingDetails {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

interface User {
  _id: string;
  name: string;
}

function ResumeCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [ratingDetails, setRatingDetails] = useState<RatingDetails | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLimit] = useState(5);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const reviewFormRef = useRef<HTMLDivElement>(null);

  // Discussion board states
  const [activeTab, setActiveTab] = useState<'reviews' | 'discussion' | 'quiz'>('reviews');
  const currentUser = {
    _id: localStorage.getItem('userId') || 'unknown',
    name: 'Current User' // Replace with actual user name from your auth system
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await backendRequest('GET', `/student/resume-course/${courseId}`);
        
        if (response.success) {
          setCourseData(response.data);
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

  useEffect(() => {
    if (courseId) {
      fetchReviews();
      fetchRatingDetails();
    }
  }, [courseId, reviewsPage]);

  const fetchReviews = async () => {
    try {
      const response = await backendRequest(
        'GET', 
        `/review/${courseId}?page=${reviewsPage}&limit=${reviewsLimit}`
      );
      
      if (response.success) {
        const userId = localStorage.getItem('userId');
        const userReviewIndex = response.data.findIndex((review: Review) => review.user._id === userId);
        
        if (userReviewIndex !== -1) {
          const userReview = response.data[userReviewIndex];
          setUserReview(userReview);
          setReviewRating(userReview.rating);
          setReviewComment(userReview.comment);
          
          const otherReviews = [...response.data];
          otherReviews.splice(userReviewIndex, 1);
          setReviews(otherReviews);
        } else {
          setUserReview(null);
          setReviews(response.data);
        }
        
        setReviewsTotalPages(response.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchRatingDetails = async () => {
    try {
      const response = await backendRequest('GET', `/review/review-rating/${courseId}`);
      if (response.success) {
        setRatingDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching rating details:", error);
    }
  };

  const handleVideoSelect = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  const handleEditReview = () => {
    setIsEditingReview(true);
    setTimeout(() => {
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    if (userReview) {
      setReviewRating(userReview.rating);
      setReviewComment(userReview.comment);
    } else {
      setReviewRating(5);
      setReviewComment('');
    }
    setIsEditingReview(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      return;
    }
    
    try {
      setIsSubmittingReview(true);
      
      const response = await backendRequest(
        'POST',
        `/review/${courseId}`,
        {
          rating: reviewRating,
          comment: reviewComment
        }
      );
      
      if (response.success) {
        setIsEditingReview(false);
        notifyResponse(response)
        setReviewRating(5);
        setReviewComment('');
        await Promise.all([fetchReviews(), fetchRatingDetails()]);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStarRating = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={interactive ? () => setReviewRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const calculateRatingPercentage = (count: number) => {
    if (!ratingDetails || ratingDetails.totalReviews === 0) return 0;
    return (count / ratingDetails.totalReviews) * 100;
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
      <div className="bg-gradient-to-r from-custom_primary to-blue-800 py-12">
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
            
            {/* Reviews & Discussion Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'discussion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  Discussion Board
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'quiz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  Quiz
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'reviews' && (
                    <>
                      {/* Rating Summary */}
                      {ratingDetails && (
                        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                          <div className="text-center md:text-left md:mr-8">
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                              {ratingDetails.averageRating || 0}
                            </div>
                            <div className="flex justify-center md:justify-start mb-1">
                              {renderStarRating(ratingDetails.averageRating || 0)}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {ratingDetails.totalReviews} {ratingDetails.totalReviews === 1 ? 'review' : 'reviews'}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <div key={star} className="flex items-center mb-2">
                                <div className="flex items-center w-20">
                                  <span className="text-sm mr-1">{star}</span>
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="flex-1 mx-2">
                                  <div className="bg-gray-200 rounded-full h-2.5 w-full">
                                    <div 
                                      className="bg-yellow-400 h-2.5 rounded-full" 
                                      style={{ width: `${calculateRatingPercentage(ratingDetails.ratingDistribution[star as keyof typeof ratingDetails.ratingDistribution])}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="w-12 text-right text-sm text-gray-500">
                                  {ratingDetails.ratingDistribution[star as keyof typeof ratingDetails.ratingDistribution]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* User's own review or review form */}
                      <div ref={reviewFormRef} className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {userReview ? 'Your Review' : 'Write a Review'}
                        </h3>
                        
                        {!isEditingReview && userReview ? (
                          <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                <img 
                                  src="https://res.cloudinary.com/saadnaeem/image/upload/v1743880130/profile-icon-design-free-vector_luwo6w.jpg"
                                  alt={userReview.user.name} 
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{userReview.user.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(userReview.createdAt).toLocaleDateString()}
                                    {userReview.isEdited && <span className="ml-2 text-xs">(edited)</span>}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={handleEditReview}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit Review
                              </button>
                            </div>
                            <div className="mb-2">{renderStarRating(userReview.rating)}</div>
                            <p className="text-gray-700">{userReview.comment}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2">Your Rating</label>
                              <div className="flex items-center">
                                {renderStarRating(reviewRating, true)}
                                <span className="ml-2 text-gray-600">({reviewRating}/5)</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2">Your Review</label>
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                placeholder="Share your experience with this course..."
                              />
                            </div>
                            <div className="flex justify-end space-x-3">
                              {userReview && (
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                  disabled={isSubmittingReview}
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={handleSubmitReview}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800 flex items-center"
                                disabled={isSubmittingReview || !reviewComment.trim()}
                              >
                                {isSubmittingReview ? (
                                  <>Submitting...</>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    {userReview ? 'Update Review' : 'Submit Review'}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Other reviews */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Student Feedback
                        </h3>
                        
                        {reviews.length > 0 ? (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
                                <div className="flex mb-2">
                                  <img 
                                    src="https://res.cloudinary.com/saadnaeem/image/upload/v1743880130/profile-icon-design-free-vector_luwo6w.jpg"
                                    alt={review.user.name} 
                                    className="w-10 h-10 rounded-full mr-3"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">{review.user.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                      {review.isEdited && <span className="ml-2 text-xs">(edited)</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-2">{renderStarRating(review.rating)}</div>
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No reviews yet. Be the first to leave a review!
                          </div>
                        )}
                        
                        {/* Pagination */}
                        {reviewsTotalPages > 1 && (
                          <div className="flex justify-center items-center mt-8">
                            <button
                              onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                              disabled={reviewsPage === 1}
                              className={`flex items-center px-3 py-1 rounded ${
                                reviewsPage === 1 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <ChevronLeft className="w-5 h-5" />
                              Prev
                            </button>
                            
                            <div className="flex space-x-1 mx-2">
                              {Array.from({ length: reviewsTotalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setReviewsPage(page)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    reviewsPage === page
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => setReviewsPage(prev => Math.min(prev + 1, reviewsTotalPages))}
                              disabled={reviewsPage === reviewsTotalPages}
                              className={`flex items-center px-3 py-1 rounded ${
                                reviewsPage === reviewsTotalPages 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              Next
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                    {activeTab === 'discussion' && (
                    <div className="h-[600px]">
                      <DiscussionBoard courseId={courseId || ''} currentUser={currentUser} />
                    </div>
                  )}
                    {activeTab === 'quiz' && (
                    <div className="h-[600px]">
                      <QuizPage courseId={courseId || ''}  />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Progress Info */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-4">
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
            </div> */}

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Course Curriculum</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-custom_primary h-2 rounded-full" 
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
                              <Play className="w-4 h-4 text-custom_primary" />
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