import React, { useState, useEffect } from 'react';
import { Bell, Camera, Edit2, Book, Mail, Calendar, BookOpen } from 'lucide-react';
import { LiaCertificateSolid } from "react-icons/lia";
import { backendRequest } from '@/Helper/backendRequest';

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isCoursesFetched, setIsCoursesFetched] = useState(false);
  const [isCertificatesFetched, setIsCertificatesFetched] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const userId = 'your-user-id'; // Replace with the actual user ID

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
    return <div>Loading...</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableProfile({ ...profile });
      setAvatarPreview(null);
      setCoverPreview(null);
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

  const handleSave = () => {
    if (editableProfile) {
      setProfile(editableProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableProfile({ ...profile });
    setAvatarPreview(null);
    setCoverPreview(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <main className="max-w-6xl mx-auto p-4">
        {/* Cover Photo */}
        <div className="relative mb-16 sm:mb-24 rounded-lg overflow-hidden shadow-md">
          <div className="h-48 sm:h-64 md:h-72 bg-indigo-100 relative">
            <img
              src={coverPreview || profile.profilePicture}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer">
                <Camera size={20} className="text-gray-700" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCoverPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Profile Picture */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-16">
            <div className="relative">
           
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <Camera size={16} className="text-gray-700" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mb-6">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editableProfile?.name || ''}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-center w-full mb-2 border-b border-gray-200 focus:outline-none focus:border-indigo-300"
                />
                <input
                  type="text"
                  name="username"
                  value={editableProfile?.username || ''}
                  onChange={handleInputChange}
                  className="text-gray-500 text-center w-full mb-4 border-b border-gray-200 focus:outline-none focus:border-indigo-300"
                />

              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                <p className="text-gray-500 mb-4">@{profile.username}</p>
              </>
            )}
          </div>

          {/* Learning Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="text-center bg-indigo-50 p-3 rounded-lg w-32">
              <div className="flex justify-center mb-1">
                <Book size={20} className="text-indigo-600" />
              </div>
              <p className="font-bold text-gray-900">{profile.stats.coursesCompleted}</p>
              <p className="text-gray-600 text-sm">Courses Completed</p>
            </div>

            <div className="text-center bg-indigo-50 p-3 rounded-lg w-32">
              <div className="flex justify-center mb-1">
                <LiaCertificateSolid size={20} className="text-indigo-600" />
              </div>
              <p className="font-bold text-gray-900">{profile.stats.certificatesEarned}</p>
              <p className="text-gray-600 text-sm">Certificates</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-gray-700">
              <Mail size={18} className="mr-2 text-gray-500" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableProfile?.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-1 border-b border-gray-200 focus:outline-none focus:border-indigo-300"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
         
            <div className="flex items-center text-gray-700">
              <Calendar size={18} className="mr-2 text-gray-500" />
              <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>

            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'courses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'certificates' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Certificates
            </button>
          </div>

          <div className="p-4">
            {/* My Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                {tabLoading ? (
                  <div>Loading courses...</div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center border rounded-md p-3 hover:bg-gray-50">
                        <img src={course.thumbnail} alt={course.title} className="w-16 h-12 object-cover rounded mr-4" />
                        <div className="flex-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-500">by {course.instructor}</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
                        </div>
                        <button className="ml-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm hover:bg-indigo-200">
                          Continue
                        </button>
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
                  <div>Loading certificates...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-white">
                        <div className="flex items-center mb-4">
                          <LiaCertificateSolid size={24} className="text-indigo-600 mr-2" />
                          <h3 className="font-bold text-lg">{cert.title}</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issued</span>
                            <span>{cert.issueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Credential ID</span>
                            <span className="font-mono">{cert.credential}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            Download PDF
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