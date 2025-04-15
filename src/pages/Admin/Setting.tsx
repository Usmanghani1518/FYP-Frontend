import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Save, Lock, MailCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { notifyResponse } from '@/Helper/notify';

// Define User interface directly in the file
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profilePicture?: string;
  emailConfirmed: boolean;
  activate: boolean;
}

// Form validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profilePicture: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  activate: z.boolean()
});

type UserFormData = z.infer<typeof userSchema>;

export const UserSettings = ({ userData }: { userData: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      profilePicture: userData.profilePicture,
      activate: userData.activate
    }
  });

  const activateStatus = watch('activate');

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture,
        activate: userData.activate
      });
      if (userData.profilePicture) {
        setPreviewImage(userData.profilePicture);
      }
    }
  }, [userData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      notifyResponse(result, "Profile updated successfully", "Failed to update profile");
    } catch (error) {
      notifyResponse({ 
        success: false, 
        detail: "Network error occurred. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-purple-100 dark:border-gray-700">
                {previewImage ? (
                  <AvatarImage src={previewImage} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-purple-500 text-white text-4xl">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer transition-all hover:bg-purple-700 group-hover:opacity-100 opacity-90"
              >
                <Camera className="h-5 w-5 text-white" />
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{userData.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
              <p className="mt-1 px-3 py-1 text-xs font-medium rounded-full capitalize"
                style={{
                  backgroundColor: userData.role === 'admin' ? '#6B46C1' : 
                                   userData.role === 'teacher' ? '#4299E1' : '#48BB78',
                  color: 'white'
                }}
              >
                {userData.role}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <MailCheck className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Verified
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${userData.emailConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {userData.emailConfirmed ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-2/3 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="mt-1"
                  error={errors.name?.message}
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1"
                  error={errors.email?.message}
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Change Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="mt-1 pr-10"
                    placeholder="Leave blank to keep current"
                    error={errors.password?.message}
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label htmlFor="activate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Status
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activateStatus ? 'Your account is active' : 'Your account is disabled'}
                  </p>
                </div>
                <Switch
                  id="activate"
                  checked={activateStatus}
                  onCheckedChange={(checked) => reset({ ...watch(), activate: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2" loading={isLoading}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};