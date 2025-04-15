import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Briefcase, Link, Trash2, Edit, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notifyResponse } from '@/Helper/notify';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface SocialAccount {
  platform: 'facebook' | 'twitter' | 'linkedin';
  url: string;
}

interface Teacher {
  _id: string;
  user: User;
  bio?: string;
  headline: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  socialAccounts?: SocialAccount[];
}

const teacherSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  headline: z.string().min(10, "Headline must be at least 10 characters"),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  socialAccounts: z.array(
    z.object({
      platform: z.enum(["facebook", "twitter", "linkedin"]),
      url: z.string().url("Invalid URL")
    })
  ).optional()
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export const TeacherSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userData, setUserData] = useState<User>({
    _id: '',
    name: '',
    email: '',
    profilePicture: undefined
  });
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      bio: '',
      headline: '',
      experience: 'beginner',
      socialAccounts: []
    }
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('/api/teacher/settings');
        const data = await response.json();
        if (response.ok) {
          setTeacherData(data);
          setUserData(data.user);
          setSocialAccounts(data.socialAccounts || []);
          reset({
            bio: data.bio,
            headline: data.headline,
            experience: data.experience,
            socialAccounts: data.socialAccounts || []
          });
        } else {
          notifyResponse({ success: false, detail: "Failed to fetch teacher data" });
        }
      } catch (error) {
        notifyResponse({ 
          success: false, 
          detail: "Network error occurred. Please try again." 
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchTeacherData();
  }, [reset]);

  const addSocialAccount = () => {
    setSocialAccounts([...socialAccounts, { platform: 'facebook', url: '' }]);
  };

  const removeSocialAccount = (index: number) => {
    const updatedAccounts = [...socialAccounts];
    updatedAccounts.splice(index, 1);
    setSocialAccounts(updatedAccounts);
    setValue('socialAccounts', updatedAccounts);
  };

  const updateSocialAccount = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedAccounts = [...socialAccounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    setSocialAccounts(updatedAccounts);
    setValue('socialAccounts', updatedAccounts);
  };

  const handleUserUpdate = () => {
    // Here you would typically make an API call to update user data
    setIsEditingUser(false);
    notifyResponse({ success: true, detail: "User information updated successfully" });
  };

  const onSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/teacher/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      notifyResponse(result, "Teacher profile updated successfully", "Failed to update teacher profile");
      if (result.success) {
        setTeacherData(result.data);
      }
    } catch {
      notifyResponse({ 
        success: false, 
        detail: "Network error occurred. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg shadow-gray-800/50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg shadow-gray-800/50">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16 border-2 border-purple-200 border-gray-700">
          {userData.profilePicture ? (
            <AvatarImage src={userData.profilePicture} />
          ) : (
            <AvatarFallback className="bg-purple-500 text-white text-2xl">
              {userData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          {isEditingUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="bg-gray-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="bg-gray-800"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleUserUpdate}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingUser(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-gray-400 hover:text-purple-400"
                  onClick={() => setIsEditingUser(true)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-400">{userData.email}</p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-purple-400" />
        Teacher Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="headline" className="block text-sm font-medium text-gray-300 mb-2">
              Professional Headline
            </Label>
            <Input
              id="headline"
              {...register('headline')}
              className={`mt-1 bg-gray-800 ${errors.headline ? 'border-red-500' : ''}`}
              placeholder="e.g. Senior Web Developer & Educator"
            />
            {errors.headline?.message && (
              <p className="mt-1 text-sm text-red-400">{errors.headline.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
              Teaching Experience Level
            </Label>
            <Select
              onValueChange={(value) => setValue('experience', value as "beginner" | "intermediate" | "advanced")}
              defaultValue={teacherData?.experience || 'beginner'}
            >
              <SelectTrigger className="mt-1 bg-gray-800">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800">
                <SelectItem value="beginner" className="hover:bg-gray-700">Beginner</SelectItem>
                <SelectItem value="intermediate" className="hover:bg-gray-700">Intermediate</SelectItem>
                <SelectItem value="advanced" className="hover:bg-gray-700">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience?.message && (
              <p className="mt-1 text-sm text-red-400">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </Label>
            <Textarea
              id="bio"
              {...register('bio')}
              className={`mt-1 min-h-[120px] bg-gray-800 ${errors.bio ? 'border-red-500' : ''}`}
              placeholder="Tell students about your background, expertise, and teaching style..."
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-red-400">
                {errors.bio?.message}
              </p>
              <p className="text-xs text-gray-400">
                {watch('bio')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-300">
                Social Accounts
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialAccount}
                className="flex items-center gap-1"
              >
                <Link className="h-4 w-4" />
                Add Account
              </Button>
            </div>
            
            {socialAccounts.length > 0 && (
              <div className="space-y-3">
                {socialAccounts.map((account, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select
                      value={account.platform}
                      onValueChange={(value) => updateSocialAccount(index, 'platform', value)}
                    >
                      <SelectTrigger className="w-32 bg-gray-800">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800">
                        <SelectItem value="facebook" className="hover:bg-gray-700">Facebook</SelectItem>
                        <SelectItem value="twitter" className="hover:bg-gray-700">Twitter</SelectItem>
                        <SelectItem value="linkedin" className="hover:bg-gray-700">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={account.url}
                      onChange={(e) => updateSocialAccount(index, 'url', e.target.value)}
                      placeholder="Profile URL"
                      className="flex-1 bg-gray-800"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialAccount(index)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="submit" 
            className="gap-2 bg-purple-700 hover:bg-purple-800"
            loading={isLoading}
          >
            <Save className="h-4 w-4" />
            Save Teacher Profile
          </Button>
        </div>
      </form>
    </div>
  );
};