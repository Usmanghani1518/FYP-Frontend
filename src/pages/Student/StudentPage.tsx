import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Star, 
  Clock, 
  Award, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  Badge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { backendRequest } from "@/Helper/backendRequest";
import { notifyResponse } from "@/Helper/notify";
import { useNavigate } from "react-router-dom";

// Define types for the data
interface Course {
  _id: string;
  title: string;
  description: string;
  teacher?: string;
  level: string;
  thumbnail: string;
  price: number;
  category: string;
  averageRating?: number;
}

interface Certificate {
  _id: string;
  title: string;
  issueDate: string;
  image: string;
}

function StudentPage() {
  const [activeTab, setActiveTab] = useState("my-learning");
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecommendedFetched, setIsRecommendedFetched] = useState(false);
  const [isCertificatesFetched, setIsCertificatesFetched] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch enrolled courses
      const enrolledRes = await backendRequest("GET", "/student/courses");
      if (Array.isArray(enrolledRes.data)) {
        setEnrolledCourses(enrolledRes.data);
      }

      // Fetch top courses
      const topCoursesRes = await backendRequest("GET", "/student/courses/top");
      if (Array.isArray(topCoursesRes.data)) {
        setTopCourses(topCoursesRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyResponse({ success: false, detail: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCourses = async () => {
    if (isRecommendedFetched) return; 
    setTabLoading(true);
    try {
      const recommendedRes = await backendRequest("GET", "/student/recommended-courses");
      if (Array.isArray(recommendedRes.data)) {
        setRecommendedCourses(recommendedRes.data);
        setIsRecommendedFetched(true);
      }
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      notifyResponse({ success: false, detail: "Failed to fetch recommended courses" });
    } finally {
      setTabLoading(false);
    }
  };

  const fetchCertificates = async () => {
    if (isCertificatesFetched) return; // Skip if already fetched
    setTabLoading(true);
    try {
      const certificatesRes = await backendRequest("GET", "/student/certificates");
      if (Array.isArray(certificatesRes.data)) {
        setCertificates(certificatesRes.data);
        setIsCertificatesFetched(true);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      notifyResponse({ success: false, detail: "Failed to fetch certificates" });
    } finally {
      setTabLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recommended") {
      fetchRecommendedCourses();
    } else if (activeTab === "certificates") {
      fetchCertificates();
    }
  }, [activeTab]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleDetail = (id: string) => {
    navigate(`/student/course/${id}`);
  };
  const handleResume = (id: string) => {
    navigate(`/student/course-resume/${id}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-custom_primary text-white py-3 rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-purple-200">Continue your learning journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-700 hover:bg-purple-600 text-white">
                Pro Member
              </Badge>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                <span>{enrolledCourses.length} courses in progress</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-white/20 p-3 mr-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <p className="text-blue-100">Total Enrolled Courses</p>
                <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
                <p className="text-sm text-blue-100">Last 30 days</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-white/20 p-3 mr-4">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-purple-100">Completed Courses</p>
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-sm text-purple-100">Keep going!</p>
              </div>
            </CardContent>
          </Card>
          
        </div>

        {/* Continue Learning Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Button onClick={()=>navigate("/student/courses")} variant="outline" size="sm">
              View all courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button className="bg-white text-purple-900 hover:bg-gray-100">
                      Continue
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">Instructor : <span className="text-purple-800 font-semibold">{course.teacher || "Unknown Instructor"}</span></p>
                  
                 
                  <div className="flex justify-between items-center text-sm">
                    <Button 
                    onClick = {()=> handleResume(course._id)}
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-700 hover:text-purple-900 p-0"
                    >
                      Resume
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Coursesss</h2>
            <Button onClick={()=>navigate("/student/courses")} variant="outline" size="sm">
              View all courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCourses.map((course) => (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-50">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button onClick = {()=> handleDetail(course._id)} className="bg-white text-purple-900 hover:bg-gray-100">
                      Enroll Now
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.teacher || "Unknown Instructor"}</p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <span className="font-bold">{course.averageRating || 0.0}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.averageRating || 0.0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${course.price}</span>
                    <Button onClick = {()=> handleDetail(course._id)} size="sm">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs 
          defaultValue="my-learning" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-12"
        >
          <TabsList className="mb-8 bg-transparent border-b w-full justify-start">
            <TabsTrigger 
              value="my-learning"
              className={`pb-4 px-6 rounded-none border-b-2 ${
                activeTab === "my-learning" 
                  ? "border-purple-700 text-purple-700" 
                  : "border-transparent"
              }`}
            >
              My Learning
            </TabsTrigger>
            <TabsTrigger 
              value="recommended"
              className={`pb-4 px-6 rounded-none border-b-2 ${
                activeTab === "recommended" 
                  ? "border-purple-700 text-purple-700" 
                  : "border-transparent"
              }`}
            >
              Recommended
            </TabsTrigger>
            <TabsTrigger 
              value="certificates"
              className={`pb-4 px-6 rounded-none border-b-2 ${
                activeTab === "certificates" 
                  ? "border-purple-700 text-purple-700" 
                  : "border-transparent"
              }`}
            >
              Certificates
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="my-learning" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {enrolledCourses.map((course) => (
                <Card key={course._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.teacher || ""}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress: 45%</span>
                      </div>
                      {/* <Progress value={45} className="h-2 bg-gray-200" /> */}
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-semibold mb-1">Level: {course.level}</p>
                      <p className="text-gray-700"></p>
                    </div>
                    
                    <Button className="w-full mt-4">Continue Learning</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-0">
  {tabLoading ? (
    <div className="flex justify-center items-center h-40">
      <div>Loading recommended courses...</div>
    </div>
  ) : (
    recommendedCourses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recommendedCourses.map((course) => (
          <Card key={course._id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-40 object-cover"
              />
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{course.teacher || "Unknown Instructor"}</p>
              
              <div className="flex items-center gap-1 mb-3">
                <span className="font-bold">{course.averageRating || 0}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold">${course.price}</span>
                <Button onClick = {()=> handleDetail(course._id)} size="sm">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommended Courses</h3>
        <p className="text-gray-500 max-w-md">
          We couldn't find any courses to recommend at this time. Check back later!
        </p>
      </div>
    )
  )}
</TabsContent>
          
          <TabsContent value="certificates" className="mt-0">
            {tabLoading ? (
              <div>Loading certificates...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificates.map((certificate) => (
                  <Card key={certificate._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-40">
                      <img 
                        src={certificate.image} 
                        alt={certificate.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h3 className="text-white text-xl font-bold text-center px-4">
                          {certificate.title}
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-5 flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Issued: {certificate.issueDate}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Share</Button>
                        <Button size="sm">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed border-2 border-gray-300 flex items-center justify-center p-6 h-full">
                  <div className="text-center text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-bold text-lg mb-2">Complete more courses</h3>
                    <p className="text-sm">Earn certificates by completing courses</p>
                    <Button variant="outline" className="mt-4">Browse Courses</Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">EduConnect</h2>
              <p className="text-purple-200">Empowering Minds, Shaping the Future</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-purple-200 hover:text-white">
                  <TrendingUp className="h-6 w-6" />
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <BookOpen className="h-6 w-6" />
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <Award className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white">Home</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Courses</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-purple-200">Email: support@educonnect.com</p>
              <p className="text-purple-200">Phone: +1 234 567 890</p>
              <p className="text-purple-200">Address: 123 Edu Street, Knowledge City</p>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center">
            <p className="text-purple-200">© 2024 EduConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StudentPage;