import React, { useState, useEffect } from 'react';
import { Bell, Camera, Edit2, Book, Mail, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { LiaCertificateSolid } from "react-icons/lia";
import { backendRequest } from '@/Helper/backendRequest';
import { notifyResponse } from '@/Helper/notify';
import { useNavigate } from 'react-router-dom';

type Course = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string;
};

type Certificate = {
  id: string;
  title: string;
  issueDate: string;
  credential: string;
};

type UserProfile = {
  name: string;
  username: string;
  createdAt: string;
  email: string;
  profilePicture: string;
  stats: {
    coursesCompleted: number;
    certificatesEarned: number;
  };
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isCoursesFetched, setIsCoursesFetched] = useState(false);
  const [isCertificatesFetched, setIsCertificatesFetched] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const userId = 'your-user-id'; // Replace with the actual user ID

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await backendRequest("GET", "/student/profile");
        const statistics = await backendRequest("GET", "/student/stats");

        setProfile({
          ...profileData.data,
          stats: statistics.data,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'courses' && !isCoursesFetched) {
      fetchCourses();
    } else if (activeTab === 'certificates' && !isCertificatesFetched) {
      fetchCertificates();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    setTabLoading(true);
    try {
      const enrolledCourses = await backendRequest("GET", "/student/courses");
      if(Array.isArray(enrolledCourses.data)){
        setCourses(enrolledCourses.data);
      }
      setIsCoursesFetched(true);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setTabLoading(false);
    }
  };

  const fetchCertificates = async () => {
    setTabLoading(true);
    try {
      const certificatesData = await backendRequest("GET", "/student/certificates");
      if(Array.isArray(certificatesData.data)){
        setCertificates(certificatesData.data);
      }
      setIsCertificatesFetched(true);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setTabLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableProfile({ ...profile });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditableProfile((prev) => ({
        ...prev!,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setEditableProfile((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (editableProfile) {
      try {
        setIsEditing(true); // Show loading state
        const response = await backendRequest(
          "PUT", 
          "/student/update", 
          {
            name: editableProfile.name,
            // email: editableProfile.email
            // Add any other fields you want to update
          }
        );

        if (response.success) {
          setProfile(editableProfile);
          setIsEditing(false);
          notifyResponse({ success: true, detail: "Profile updated successfully" });
        } else {
          notifyResponse({ success: false, detail: "Failed to update profile" });
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        notifyResponse({ success: false, detail: "Error updating profile" });
      } finally {
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableProfile({ ...profile });
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {/* Profile Header - Centered */}
        <div className="flex flex-col items-center pt-8">
          {/* Profile Picture with Initials */}
          <div className="relative mb-6">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-custom_primary flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg">
              {getInitials(profile.name)}
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={editableProfile?.name || ''}
                  onChange={handleInputChange}
                  className="text-3xl font-bold text-center w-full mb-2 border-b border-gray-200 focus:outline-none focus:border-indigo-300 bg-transparent"
                />
                
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                {/* <p className="text-lg text-gray-600 mb-4">@{profile.username}</p> */}
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <div className="mb-8">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-custom_primary text-white rounded-lg hover:bg-custom_primary_hover transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-custom_primary text-white rounded-lg hover:bg-custom_primary_hover transition-colors shadow-md"
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Book size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.stats.coursesCompleted}</p>
                <p className="text-gray-500">Courses Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <LiaCertificateSolid size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.stats.certificatesEarned}</p>
                <p className="text-gray-500">Certificates Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editableProfile?.email || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border-b border-gray-200 focus:outline-none focus:border-indigo-300"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-900">{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'courses' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'certificates' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Certificates
            </button>
          </div>

          <div className="p-6">
            {/* My Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                {tabLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No courses enrolled yet</h3>
                    <p className="text-gray-500 mt-2">Start learning by exploring our courses</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex flex-col sm:flex-row items-center gap-4 border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full sm:w-32 h-24 object-cover rounded-lg" 
                        />
                        <div className="flex-1 w-full">
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                         
                          <div className="flex justify-end items-center">
                            {/* <span className="text-xs text-gray-500">{course.progress}% complete</span> */}
                            <button onClick={()=>{console.log("courseid is ",course._id);navigate(`/student/course-resume/${course._id}`)}} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                              Continue <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                {tabLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <LiaCertificateSolid size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No certificates earned yet</h3>
                    <p className="text-gray-500 mt-2">Complete courses to earn certificates</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <LiaCertificateSolid size={24} className="text-indigo-600" />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">{cert.title}</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Issued</span>
                            <span className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Credential ID</span>
                            <span className="font-mono text-gray-700">{cert.credential}</span>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            Download Certificate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;