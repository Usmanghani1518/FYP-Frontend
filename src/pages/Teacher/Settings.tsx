import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Briefcase, Link, Trash2, Edit, User, Mail, Loader2, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notifyResponse } from '@/Helper/notify';
import { backendRequest } from '@/Helper/backendRequest';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialAccount {
  platform: 'facebook' | 'twitter' | 'linkedin';
  url: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
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
    formState: { errors, isDirty },
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
        const response = await backendRequest<Teacher>("GET", "/teacher/profile");
        
        if (response.success) {
          const data = response.data;
          setTeacherData(data);
          setUserData(data.user);
          setSocialAccounts(data.socialAccounts || []);
          reset({
            bio: data.bio || '',
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
    const newAccounts = [...socialAccounts, { platform: 'facebook', url: '' }];
    setSocialAccounts(newAccounts);
    setValue('socialAccounts', newAccounts, { shouldDirty: true });
  };

  const removeSocialAccount = (index: number) => {
    const updatedAccounts = [...socialAccounts];
    updatedAccounts.splice(index, 1);
    setSocialAccounts(updatedAccounts);
    setValue('socialAccounts', updatedAccounts, { shouldDirty: true });
  };

  const updateSocialAccount = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedAccounts = [...socialAccounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    setSocialAccounts(updatedAccounts);
    setValue('socialAccounts', updatedAccounts, { shouldDirty: true });
  };

  const handleUserUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await backendRequest("PUT", "/teacher/update", {
        name: userData.name,
        email: userData.email
      });
      
      notifyResponse(response, "User information updated successfully");
      if (response.success) {
        setIsEditingUser(false);
        setUserData(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      notifyResponse({ success: false, detail: "Failed to update user information" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);
    try {
      const response = await backendRequest("PUT", "/teacher/update", data);
      notifyResponse(response, "Teacher profile updated successfully");
      if (response.success) {
        setTeacherData(response.data);
        reset(data); // Reset form state to mark as clean
      }
    } catch (error) {
      notifyResponse({ success: false, detail: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-purple-500/20">
              <AvatarImage src={userData.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-2xl font-medium">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {isEditingUser ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleUserUpdate}
                      loading={isLoading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingUser(false)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsEditingUser(true)}
                      className="text-purple-400 hover:text-purple-300 hover:bg-gray-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  <p className="text-gray-400">{userData.email}</p>
                  
                  {teacherData?.headline && (
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="bg-gray-800 border-gray-700 text-purple-400">
                        {teacherData.experience}
                      </Badge>
                      <p className="text-sm text-gray-300">{teacherData.headline}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Teacher Profile Form */}
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Teacher Profile</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              {/* Headline Field */}
              <div className="space-y-2">
                <Label htmlFor="headline" className="text-sm font-medium text-gray-300">
                  Professional Headline
                </Label>
                <Input
                  id="headline"
                  {...register('headline')}
                  className={`bg-gray-800 border-gray-700 text-white ${errors.headline ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'}`}
                  placeholder="e.g. Senior Web Developer & Educator"
                />
                {errors.headline?.message && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.headline.message}
                  </p>
                )}
                {!errors.headline && watch('headline') && (
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Looks good
                  </p>
                )}
              </div>

              {/* Experience Field */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-300">
                  Teaching Experience Level
                </Label>
                <Select
                  onValueChange={(value) => setValue('experience', value as "beginner" | "intermediate" | "advanced", { shouldDirty: true })}
                  defaultValue={teacherData?.experience || 'beginner'}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-purple-500">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="beginner" className="hover:bg-gray-700 focus:bg-gray-700">Beginner</SelectItem>
                    <SelectItem value="intermediate" className="hover:bg-gray-700 focus:bg-gray-700">Intermediate</SelectItem>
                    <SelectItem value="advanced" className="hover:bg-gray-700 focus:bg-gray-700">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience?.message && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  className={`min-h-[120px] bg-gray-800 border-gray-700 text-white ${errors.bio ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'}`}
                  placeholder="Tell students about your background, expertise, and teaching style..."
                />
                <div className="flex justify-between items-center">
                  {errors.bio?.message ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.bio.message}
                    </p>
                  ) : (
                    <div className="text-sm text-gray-400">
                      {watch('bio')?.length || 0}/500 characters
                    </div>
                  )}
                  {!errors.bio && watch('bio') && (
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Looks good
                    </p>
                  )}
                </div>
              </div>

              {/* Social Accounts */}
              <div className="space-y-3">
                {/* <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-300">
                    Social Accounts
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialAccount}
                    className="text-purple-400 border-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div> */}
                
                {socialAccounts.length > 0 && (
                  <div className="space-y-3">
                    {socialAccounts.map((account, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Select
                          value={account.platform}
                          onValueChange={(value) => updateSocialAccount(index, 'platform', value)}
                        >
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="facebook" className="hover:bg-gray-700">Facebook</SelectItem>
                            <SelectItem value="twitter" className="hover:bg-gray-700">Twitter</SelectItem>
                            <SelectItem value="linkedin" className="hover:bg-gray-700">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={account.url}
                          onChange={(e) => updateSocialAccount(index, 'url', e.target.value)}
                          placeholder="Profile URL"
                          className="flex-1 bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialAccount(index)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                loading={isLoading}
                disabled={!isDirty || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};