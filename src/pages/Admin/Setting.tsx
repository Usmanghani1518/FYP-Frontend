import React, { useEffect, useState } from 'react';
import { Lock, User, Mail, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { backendRequest } from '@/Helper/backendRequest';
import { notifyResponse } from '@/Helper/notify';

const AdminSettings: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data from the backend
    const fetchProfile = async () => {
      try {
        interface ProfileResponse {
          success: boolean;
          data?: {
            name: string;
            email: string;
          };
          detail?: string;
        }

        const response: ProfileResponse = await backendRequest("GET", "/admin/profile");
        if (response.success && response.data) {
          setProfile({
            name: response.data.name,
            email: response.data.email,
          });
        } else {
          notifyResponse({ success: false, detail: response.detail || "Failed to fetch profile" });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        notifyResponse({ success: false, detail: "Error fetching profile" });
      }
    };

    fetchProfile();
 
  }, []); 

  const validatePassword = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await backendRequest("PUT", "/admin/profile", {
        name: profile.name
      });

      if (response.success) {
        notifyResponse({ success: true, detail: "Profile updated successfully" });
        setIsEditing(false);
      } else {
        notifyResponse({ success: false, detail: response.detail || "Failed to update profile" });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      notifyResponse({ success: false, detail: "Error updating profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      const response = await backendRequest("PUT", "/admin/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        notifyResponse({ success: true, detail: "Password updated successfully" });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsUpdatingPassword(false);
      } else {
        notifyResponse({ success: false, detail: response.detail || "Failed to update password" });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      notifyResponse({ success: false, detail: "Error updating password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>

        {/* Profile Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h2>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="bg-custom_primary hover:bg-custom_primary_hover "
                  >
                    {isLoading ? 'Saving...' : (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Save
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Name</label>
              {isEditing ? (
                <Input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              ) : (
                <p className="text-gray-100">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </label>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Password Update Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password
              </h2>
              {isUpdatingPassword ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsUpdatingPassword(false)}
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdatePassword}
                    disabled={isLoading}
                    className="bg-custom_primary hover:bg-custom_primary_hover "
                  >
                    {isLoading ? 'Updating...' : (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Update
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsUpdatingPassword(true)}
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                >
                  Change Password
                </Button>
              )}
            </div>
          </div>

          {isUpdatingPassword && (
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Current Password</label>
                <div className="relative">
                  <Input
                    name="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`bg-gray-700 border-gray-600 text-gray-100 ${errors.currentPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-400 text-sm">{errors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">New Password</label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`bg-gray-700 border-gray-600 text-gray-100 ${errors.newPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-sm">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`bg-gray-700 border-gray-600 text-gray-100 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;